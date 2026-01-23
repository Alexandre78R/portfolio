import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  Authorized,
  Ctx,
  Args,
} from "type-graphql";
import { Signature } from "../entities/signature.entity";
import { PrismaClient, Signature as PrismaSignature } from "@prisma/client";
import {
  SignatureResponse,
  SignaturesResponse,
  PaginationArgs,
} from "../types/response.types";
import {
  CreateSignatureInput,
  UpdateSignatureInput,
} from "../entities/inputs/signature.input";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";

@Resolver(() => Signature)
export class SignatureResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Query(() => SignaturesResponse)
  async listSignatures(
    @Args() { page, limit, searchTerm }: PaginationArgs
  ): Promise<SignaturesResponse> {
    try {
      const skip: number = (page - 1) * limit;

      const whereClause: { name?: { contains: string; mode: "insensitive" } } =
        searchTerm
          ? {
              name: { contains: searchTerm, mode: "insensitive" },
            }
          : {};

      const signatures: PrismaSignature[] = await this.db.signature.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { id: "desc" },
      });

      const total: number = await this.db.signature.count({
        where: whereClause,
      });

      return {
        code: 200,
        message: "Signatures fetched successfully",
        signatures,
        total,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error fetching signatures:", errorMessage);
      return {
        code: 500,
        message: "Error fetching signatures",
      };
    }
  }

  @Query(() => SignaturesResponse)
  async listAllSignatures(): Promise<SignaturesResponse> {
    try {
      const signatures: PrismaSignature[] = await this.db.signature.findMany({
        orderBy: { id: "desc" },
      });

      return {
        code: 200,
        message: "All signatures fetched successfully",
        signatures,
        total: signatures.length,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error fetching all signatures:", errorMessage);
      return {
        code: 500,
        message: "Error fetching signatures",
      };
    }
  }

  @Query(() => SignatureResponse)
  async getSignatureById(@Arg("id", () => Int) id: number): Promise<SignatureResponse> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        return {
          code: 400,
          message: "Invalid signature ID",
        };
      }

      const signature: PrismaSignature | null =
        await this.db.signature.findUnique({
          where: { id },
        });

      if (!signature) {
        return {
          code: 404,
          message: `Signature with ID ${id} not found`,
        };
      }

      return {
        code: 200,
        message: "Signature fetched successfully",
        signature,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error fetching signature:", errorMessage);
      return {
        code: 500,
        message: "Error fetching signature",
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SignatureResponse)
  async createSignature(
    @Arg("data") data: CreateSignatureInput,
    @Ctx() ctx: MyContext
  ): Promise<SignatureResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Only admins can create signatures",
        };
      }

      if (!data.name || data.name.trim().length === 0) {
        return {
          code: 400,
          message: "Signature name is required",
        };
      }

      if (!data.description || data.description.trim().length === 0) {
        return {
          code: 400,
          message: "Signature description is required",
        };
      }

      const existingSignature: PrismaSignature | null =
        await this.db.signature.findUnique({
          where: { name: data.name },
        });

      if (existingSignature) {
        return {
          code: 409,
          message: `Signature with name "${data.name}" already exists`,
        };
      }

      const signature: PrismaSignature = await this.db.signature.create({
        data: {
          name: data.name.trim(),
          description: data.description,
        },
      });

      console.log(`✅ Signature created: ${signature.name}`);

      return {
        code: 201,
        message: "Signature created successfully",
        signature,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error creating signature:", errorMessage);
      return {
        code: 500,
        message: "Error creating signature",
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SignatureResponse)
  async updateSignature(
    @Arg("data") data: UpdateSignatureInput,
    @Ctx() ctx: MyContext
  ): Promise<SignatureResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Only admins can update signatures",
        };
      }

      if (!Number.isInteger(data.id) || data.id <= 0) {
        return {
          code: 400,
          message: "Invalid signature ID",
        };
      }

      const existingSignature: PrismaSignature | null =
        await this.db.signature.findUnique({
          where: { id: data.id },
        });

      if (!existingSignature) {
        return {
          code: 404,
          message: `Signature with ID ${data.id} not found`,
        };
      }

      if (
        data.name &&
        data.name.trim().length === 0
      ) {
        return {
          code: 400,
          message: "Signature name cannot be empty",
        };
      }

      if (
        data.description &&
        data.description.trim().length === 0
      ) {
        return {
          code: 400,
          message: "Signature description cannot be empty",
        };
      }

      if (data.name && data.name !== existingSignature.name) {
        const duplicateSignature: PrismaSignature | null =
          await this.db.signature.findUnique({
            where: { name: data.name },
          });

        if (duplicateSignature) {
          return {
            code: 409,
            message: `Signature with name "${data.name}" already exists`,
          };
        }
      }

      const updateData: { name?: string; description?: string } = {};
      if (data.name !== undefined) {
        updateData.name = data.name.trim();
      }
      if (data.description !== undefined) {
        updateData.description = data.description;
      }

      const signature: PrismaSignature = await this.db.signature.update({
        where: { id: data.id },
        data: updateData,
      });

      console.log(`✅ Signature updated: ${signature.name}`);

      return {
        code: 200,
        message: "Signature updated successfully",
        signature,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error updating signature:", errorMessage);
      return {
        code: 500,
        message: "Error updating signature",
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SignatureResponse)
  async deleteSignature(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<SignatureResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Only admins can delete signatures",
        };
      }

      if (!Number.isInteger(id) || id <= 0) {
        return {
          code: 400,
          message: "Invalid signature ID",
        };
      }

      const signature: PrismaSignature | null =
        await this.db.signature.findUnique({
          where: { id },
        });

      if (!signature) {
        return {
          code: 404,
          message: `Signature with ID ${id} not found`,
        };
      }

      await this.db.signature.delete({
        where: { id },
      });

      console.log(`✅ Signature deleted: ${signature.name}`);

      return {
        code: 200,
        message: "Signature deleted successfully",
        signature,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error deleting signature:", errorMessage);
      return {
        code: 500,
        message: "Error deleting signature",
      };
    }
  }
}
