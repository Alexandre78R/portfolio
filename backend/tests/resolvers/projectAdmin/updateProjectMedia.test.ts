import "reflect-metadata";

import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateProjectInput } from "../../../src/entities/inputs/project.input";
import { ProjectResponse } from "../../../src/types/response.types";

import type {
  Project as PrismaProject,
  Skill as PrismaSkill,
  ProjectSkill as PrismaProjectSkill,
} from "@prisma/client";

import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import Cookies from "cookies";

// Mock the entire @prisma/client module
jest.mock("@prisma/client", () => ({
  ...jest.requireActual("@prisma/client"),
  PrismaClient: jest.fn(() => prismaMock),
}));

type ProjectResolverOutput = {
  id: number;
  title: string;
  descriptionEN: string;
  descriptionFR: string;
  typeDisplay: string;
  github: string | null;
  contentDisplay: string;
  skills: Array<{
    id: number;
    name: string;
    image: string;
    categoryId: number;
  }>;
};

type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<
    PrismaProjectSkill & {
      skill: PrismaSkill;
    }
  >;
};

describe("ProjectAdminResolver - updateProjectMedia", () => {
  let resolver: ProjectAdminResolver;
  let cookiesMock: DeepMockProxy<Cookies>;

  const adminUser: Readonly<User> = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const editorUser: Readonly<User> = {
    id: 2,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
    isPasswordChange: true,
  };

  const baseContext: Readonly<MyContext> = {
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: {} as Cookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const existingSkills: ReadonlyArray<PrismaSkill> = [
    { id: 1, name: "React", image: "react.png", categoryId: 10 },
    { id: 2, name: "Vue.js", image: "vue.png", categoryId: 10 },
  ];

  const existingProject: PrismaProjectWithSkills = {
    id: 1,
    title: "Existing Project",
    descriptionEN: "Project description EN",
    descriptionFR: "Project description FR",
    typeDisplay: "",
    github: "https://github.com/project",
    contentDisplay: "",
    skills: [
      { projectId: 1, skillId: 1, skill: existingSkills[0] },
    ],
  };

  const updateMediaInput: Readonly<UpdateProjectInput> = {
    id: 1,
    typeDisplay: "image",
    contentDisplay: "new-image.jpg",
  };

  const updatedProject: PrismaProjectWithSkills = {
    ...existingProject,
    typeDisplay: updateMediaInput.typeDisplay!,
    contentDisplay: updateMediaInput.contentDisplay!,
  };

  const expectedProject: ProjectResolverOutput = {
    id: updatedProject.id,
    title: updatedProject.title,
    descriptionEN: updatedProject.descriptionEN,
    descriptionFR: updatedProject.descriptionFR,
    typeDisplay: updatedProject.typeDisplay,
    github: updatedProject.github,
    contentDisplay: updatedProject.contentDisplay,
    skills: updatedProject.skills.map(({ skill }) => ({
      id: skill.id,
      name: skill.name,
      image: skill.image,
      categoryId: skill.categoryId,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    cookiesMock = mockDeep<Cookies>();

    // Resolver will use prismaMock automatically
    resolver = new ProjectAdminResolver();

    prismaMock.project.findUnique.mockReset();
    prismaMock.project.update.mockReset();
    
    // Mock $transaction to execute the callback immediately
    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      return callback(prismaMock);
    });
  });

  describe("Authentication and Authorization", () => {
    it("should return 401 when user is not authenticated", async () => {
      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        baseContext,
      );

      expect(result.code).toBe(401);
      expect(result.message).toBe("Authentication required");
      expect(result.project).toBeUndefined();
    });

    it("should allow admin user to update project media", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(updatedProject);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project updated successfully");
    });

    it("should allow editor user to update project media", async () => {
      const context: MyContext = {
        ...baseContext,
        user: editorUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(updatedProject);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project updated successfully");
    });
  });

  describe("Update Media - Success Cases", () => {
    it("should update project media successfully", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(updatedProject);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project updated successfully");
      expect(result.project).toEqual(expectedProject);
      expect(result.project?.typeDisplay).toBe("image");
      expect(result.project?.contentDisplay).toBe("new-image.jpg");
    });

    it("should update only typeDisplay when contentDisplay is not provided", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      const partialInput: UpdateProjectInput = {
        id: 1,
        typeDisplay: "video",
      };

      const partiallyUpdatedProject: PrismaProjectWithSkills = {
        ...existingProject,
        typeDisplay: "video",
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(partiallyUpdatedProject);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        partialInput,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.project?.typeDisplay).toBe("video");
      expect(result.project?.contentDisplay).toBe(existingProject.contentDisplay);
    });

    it("should update only contentDisplay when typeDisplay is not provided", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      const partialInput: UpdateProjectInput = {
        id: 1,
        contentDisplay: "updated-content.jpg",
      };

      const partiallyUpdatedProject: PrismaProjectWithSkills = {
        ...existingProject,
        contentDisplay: "updated-content.jpg",
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(partiallyUpdatedProject);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        partialInput,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.project?.contentDisplay).toBe("updated-content.jpg");
      expect(result.project?.typeDisplay).toBe(existingProject.typeDisplay);
    });

    it("should include skills in the response", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      const projectWithMultipleSkills: PrismaProjectWithSkills = {
        ...existingProject,
        skills: [
          { projectId: 1, skillId: 1, skill: existingSkills[0] },
          { projectId: 1, skillId: 2, skill: existingSkills[1] },
        ],
      };

      const updatedWithSkills: PrismaProjectWithSkills = {
        ...projectWithMultipleSkills,
        typeDisplay: updateMediaInput.typeDisplay!,
        contentDisplay: updateMediaInput.contentDisplay!,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithMultipleSkills);
      prismaMock.project.findUnique.mockResolvedValueOnce(updatedWithSkills);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.project?.skills).toBeDefined();
      expect(result.project?.skills.length).toBe(2);
      expect(result.project?.skills[0].name).toBe("React");
      expect(result.project?.skills[1].name).toBe("Vue.js");
    });

    it("should handle project with no skills", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      const projectWithNoSkills: PrismaProjectWithSkills = {
        ...existingProject,
        skills: [],
      };

      const updatedWithNoSkills: PrismaProjectWithSkills = {
        ...projectWithNoSkills,
        typeDisplay: updateMediaInput.typeDisplay!,
        contentDisplay: updateMediaInput.contentDisplay!,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithNoSkills);
      prismaMock.project.findUnique.mockResolvedValueOnce(updatedWithNoSkills);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.project?.skills).toHaveLength(0);
    });
  });

  describe("Update Media - Error Cases", () => {
    it("should return 404 when project does not exist", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(404);
      expect(result.message).toBe("Project not found");
      expect(result.project).toBeUndefined();
    });

    it("should return 500 when findUnique throws an error", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockRejectedValueOnce(
        new Error("Database error"),
      );

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(500);
      expect(result.message).toBe("Internal server error");
    });

    it("should return 500 when reload after update fails", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      const result: ProjectResponse = await resolver.updateProjectMedia(
        updateMediaInput,
        context,
      );

      expect(result.code).toBe(500);
      expect(result.message).toBe("Unexpected error after update");
    });
  });

  describe("Prisma Mock Verification", () => {
    it("should call findUnique twice (before and after transaction)", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(updatedProject);

      await resolver.updateProjectMedia(updateMediaInput, context);

      expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(2);
      
      expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
        where: { id: updateMediaInput.id },
        include: { skills: { include: { skill: true } } },
      });
    });

    it("should call transaction with correct behavior", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(updatedProject);

      await resolver.updateProjectMedia(updateMediaInput, context);

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(2);
      
      // Verify the calls were made in the correct order
      expect(prismaMock.project.findUnique).toHaveBeenNthCalledWith(1, {
        where: { id: updateMediaInput.id },
        include: { skills: { include: { skill: true } } },
      });
      
      expect(prismaMock.project.findUnique).toHaveBeenNthCalledWith(2, {
        where: { id: updateMediaInput.id },
        include: { skills: { include: { skill: true } } },
      });
    });
  });
});