import { prisma } from "@/lib/db";

export interface CreateUserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImageUrl?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImageUrl?: string;
  preferences?: Record<string, any>;
}

export class UserService {
  static async createUser(data: CreateUserData) {
    return await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phone: data.phone || null,
        profileImageUrl: data.profileImageUrl || null,
        preferences: {
          notifications: true,
          priceAlerts: true,
          emailUpdates: true,
        },
      },
    });
  }

  static async updateUser(userId: string, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        profileImageUrl: data.profileImageUrl,
        preferences: data.preferences,
      },
    });
  }

  static async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  }

  static async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          include: {
            property: {
              include: {
                images: true,
              },
            },
          },
        },
        searches: true,
        comparisons: true,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async updateUserPreferences(
    userId: string,
    preferences: Record<string, any>
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data: { preferences },
    });
  }
}
