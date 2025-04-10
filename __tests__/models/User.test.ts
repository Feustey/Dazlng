import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "@/models/User";

describe("User Model Test", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should create & save user successfully", async () => {
    const validUser = new User({
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe("test@test.com");
    expect(savedUser.name).toBe("Test User");
    expect(savedUser.password).not.toBe("password123"); // Le mot de passe doit être hashé
  });

  it("should fail to save user without required fields", async () => {
    const userWithoutRequiredField = new User({
      email: "test@test.com",
    });

    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("should fail to save user with invalid email", async () => {
    const userWithInvalidEmail = new User({
      email: "invalid-email",
      password: "password123",
      name: "Test User",
    });

    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });

  it("should fail to save duplicate email", async () => {
    const user1 = new User({
      email: "test@test.com",
      password: "password123",
      name: "Test User 1",
    });
    await user1.save();

    const user2 = new User({
      email: "test@test.com",
      password: "password456",
      name: "Test User 2",
    });

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Code d'erreur MongoDB pour les doublons
  });

  it("should hash password before saving", async () => {
    const user = new User({
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    });
    const savedUser = await user.save();

    expect(savedUser.password).not.toBe("password123");
    expect(savedUser.password).toHaveLength(60); // bcrypt génère des hashes de 60 caractères
  });
});
