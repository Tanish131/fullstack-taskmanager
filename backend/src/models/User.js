const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const users = new Map();

class User {
  constructor({ name, email, password }) {
    this.id = uuidv4();
    this.name = name;
    this.email = email.toLowerCase();
    this.password = password;
    this.createdAt = new Date().toISOString();
  }

  static async create({ name, email, password }) {
    if (User.findByEmail(email)) {
      const err = new Error('Email already in use'); err.status = 409; throw err;
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashed });
    users.set(user.id, user);
    return user;
  }

  static findByEmail(email) {
    for (const u of users.values()) {
      if (u.email === email.toLowerCase()) return u;
    }
    return null;
  }

  static findById(id) { return users.get(id) || null; }

  async comparePassword(plain) { return bcrypt.compare(plain, this.password); }

  toJSON() {
    const { password, ...safe } = this;
    return safe;
  }

  static _clear() { users.clear(); }
}

module.exports = User;
