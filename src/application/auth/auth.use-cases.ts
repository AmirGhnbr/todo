import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/user/user';
import { Email } from '../../domain/user/email.vo';
import type { IUserRepository } from '../../domain/user/user.repository';
import type { EventStore } from '../events/event-store';

export class AuthUseCases {
  constructor(
    private readonly users: IUserRepository,
    private readonly events: EventStore,
  ) {}

  async signUp(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const email = Email.create(input.email);
    const existing = await this.users.findByEmail(email.asString);
    if (existing && !existing.isDeleted) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const now = new Date();

    const user = User.create({
      id: randomUUID(),
      name: input.name,
      email,
      passwordHash,
      now,
    });

    await this.users.save(user);
    const events = user.pullEvents();
    if (events.length) {
      await this.events.appendEvents(user.id, events);
    }

    return user;
  }

  async login(input: { email: string; password: string }): Promise<User> {
    const email = Email.create(input.email);
    const user = await this.users.findByEmail(email.asString);

    if (!user || user.isDeleted) {
      throw new Error('Invalid credentials');
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}
