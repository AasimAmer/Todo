/**
 * todo controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::todo.todo', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const title = ctx.request.body?.data?.title;

    if (!user) {
      return ctx.unauthorized('You must be logged in to create a todo.');
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return ctx.badRequest('Title is required.');
    }

    const created = await strapi.db.query('api::todo.todo').create({
      data: {
        title: title.trim(),
        isCompleted: false,
        publishedAt: new Date(),
        user: user.id,
      },
    });

    const sanitized = await this.sanitizeOutput(created, ctx);
    return this.transformResponse(sanitized);
  },

  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    const todos = await strapi.db.query('api::todo.todo').findMany({
      where: {
        user: user.id,
      },
      orderBy: { createdAt: 'desc' },
    });

    const sanitized = await this.sanitizeOutput(todos, ctx);
    return this.transformResponse(sanitized);
  },

  async update(ctx) {
    const user = ctx.state.user;
    const entryKey = ctx.params.id;
    const incoming = ctx.request.body?.data ?? {};
    const numericId = Number.parseInt(entryKey, 10);
    const whereKey = Number.isNaN(numericId)
      ? { documentId: entryKey }
      : { $or: [{ documentId: entryKey }, { id: numericId }] };

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    const existing = await strapi.db.query('api::todo.todo').findOne({
      where: {
        ...whereKey,
        user: user.id,
      },
    });

    if (!existing) {
      return ctx.notFound('Todo not found.');
    }

    const nextTitle =
      typeof incoming.title === 'string' && incoming.title.trim()
        ? incoming.title.trim()
        : existing.title;

    const updated = await strapi.db.query('api::todo.todo').update({
      where: whereKey,
      data: {
        title: nextTitle,
        isCompleted:
          typeof incoming.isCompleted === 'boolean'
            ? incoming.isCompleted
            : existing.isCompleted,
        publishedAt: existing.publishedAt ?? new Date(),
        user: user.id,
      },
    });

    const sanitized = await this.sanitizeOutput(updated, ctx);
    return this.transformResponse(sanitized);
  },

  async delete(ctx) {
    const user = ctx.state.user;
    const entryKey = ctx.params.id;
    const numericId = Number.parseInt(entryKey, 10);
    const whereKey = Number.isNaN(numericId)
      ? { documentId: entryKey }
      : { $or: [{ documentId: entryKey }, { id: numericId }] };

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    const existing = await strapi.db.query('api::todo.todo').findOne({
      where: {
        ...whereKey,
        user: user.id,
      },
    });

    if (!existing) {
      return ctx.notFound('Todo not found.');
    }

    const deleted = await strapi.db.query('api::todo.todo').delete({
      where: whereKey,
    });

    const sanitized = await this.sanitizeOutput(deleted, ctx);
    return this.transformResponse(sanitized);
  },
}));
