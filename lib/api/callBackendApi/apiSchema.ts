import type { InferAllMainRouteKeys, InferAllMainRoutes } from "@zayne-labs/callapi";
import { fallBackRouteSchemaKey } from "@zayne-labs/callapi/constants";
import { defineSchema, defineSchemaRoutes } from "@zayne-labs/callapi/utils";
import { z } from "zod";

const BaseSuccessResponseSchema = z.object({
	data: z.unknown().nullable(),
	message: z.string(),
	meta: z.unknown().optional(),
	success: z.literal(true),
});

const BaseErrorResponseSchema = z.object({
	error: z.object({
		code: z.union([z.string(), z.number()]),
		details: z.unknown().optional(),
		message: z.string(),
	}),
	status: z.literal(false),
});

export type BaseApiSuccessResponse = z.infer<typeof BaseSuccessResponseSchema>;

export type BaseApiErrorResponse = z.infer<typeof BaseErrorResponseSchema>;

const withBaseSuccessResponse = <TDataSchema extends z.ZodType>(dataSchema: TDataSchema) => {
	return BaseSuccessResponseSchema.extend({
		data: dataSchema,
	});
};

const withBaseErrorResponse = <
	TErrorSchema extends z.ZodType = typeof BaseErrorResponseSchema.shape.error,
>(
	errorSchema?: TErrorSchema
) => {
	return BaseErrorResponseSchema.extend({
		error: (errorSchema ?? BaseErrorResponseSchema.shape.error) as NonNullable<TErrorSchema>,
	});
};

const stringWithNumberValidation = <TNumberSchema extends z.ZodType>(numberSchema: TNumberSchema) => {
	return z.preprocess(
		(value: number | string) => (typeof value === "string" ? Number(value) : value),
		numberSchema
	);
};

const ratingSchema = stringWithNumberValidation(
	z
		.int("Select a rating from 1 to 5.")
		.min(1, "Select a rating from 1 to 5.")
		.max(5, "Select a rating from 1 to 5.")
);

const paginatedQuerySchema = z
	.object({
		limit: z.number("Enter a valid limit."),
		page: z.number("Enter a valid page."),
		search: z.string(),
	})
	.partial();

const idParamsSchema = z.object({
	id: z.uuid("Invalid ID."),
});

const userIdParamsSchema = z.object({
	userId: z.uuid("Invalid ID."),
});

const galleryPhotoSchema = z.object({
	public_id: z.string(),
	url: z.url("Enter a valid URL."),
});

const blogSchema = z.object({
	date: z.string(),
	description: z.string().nullable().optional(),
	documentUrl: z.url("Enter a valid URL."),
	id: z.uuid("Invalid ID."),
	publicId: z.string(),
	title: z.string(),
});

const authUserSchema = z.object({
	createdAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	department: z.string(),
	email: z.email("Enter a valid email address."),
	id: z.uuid("Invalid ID."),
	name: z.string(),
	password: z.string().optional(),
	updatedAt: z.string().nullable().optional(),
});

const loginBodySchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

const defaultSchemaRoute = defineSchemaRoutes({
	[fallBackRouteSchemaKey]: {
		errorData: withBaseErrorResponse(),
	},
});

const authRoutes = defineSchemaRoutes({
	"@post/auth/login": {
		body: loginBodySchema,
		data: withBaseSuccessResponse(authUserSchema),
	},

	"@post/auth/logout": {
		data: withBaseSuccessResponse(z.null()),
	},
});

const adminRoutes = defineSchemaRoutes({
	"@delete/admin/users/:userId": {
		data: withBaseSuccessResponse(z.null()),
		params: userIdParamsSchema,
	},

	"@get/admin/roles": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
	},

	"@get/admin/roles/:userId": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		params: userIdParamsSchema,
	},

	"@get/admin/users": {
		data: withBaseSuccessResponse(z.array(authUserSchema)),
	},

	"@patch/admin/roles/:userId/action": {
		data: withBaseSuccessResponse(z.unknown()),
		params: userIdParamsSchema,
		query: z.object({
			action: z.enum(["assign", "revoke"], "Select a valid role action."),
			rolename: z.enum(["admin", "superadmin"], "Select a valid role."),
		}),
	},

	"@post/admin/users": {
		body: loginBodySchema.extend({
			department: z.enum(
				["TACOTS", "ASH", "CAPACITY BUILDING", "OUTREACHES"],
				"Select a valid department."
			),
			name: z.string().min(3, "Enter at least 3 characters."),
		}),
		data: withBaseSuccessResponse(authUserSchema),
	},
});

const blogRoutes = defineSchemaRoutes({
	"@delete/blogs/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: idParamsSchema,
	},

	"@get/blogs": {
		data: withBaseSuccessResponse(z.array(blogSchema)),
		query: paginatedQuerySchema.pick({ limit: true, page: true }),
	},

	"@get/blogs/:id": {
		data: withBaseSuccessResponse(blogSchema),
		params: idParamsSchema,
	},

	"@patch/blogs/:id": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.null()),
		params: idParamsSchema,
	},

	"@post/blogs": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(blogSchema),
	},
});

const clientSideRoutes = defineSchemaRoutes({
	"@get/carousels/ash": {
		data: withBaseSuccessResponse(z.array(galleryPhotoSchema)),
		query: paginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/capacity-building": {
		data: withBaseSuccessResponse(z.array(galleryPhotoSchema)),
		query: paginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/outreaches": {
		data: withBaseSuccessResponse(z.array(galleryPhotoSchema)),
		query: paginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/tacots": {
		data: withBaseSuccessResponse(z.array(galleryPhotoSchema)),
		query: paginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/donate/callback": {
		data: withBaseSuccessResponse(
			z.object({
				data: z.unknown(),
				message: z.string(),
				status: z.boolean("Invalid payment verification status."),
			})
		),
		query: z.object({ reference: z.string().min(1, "This field is required.") }),
	},

	"@post/donate": {
		body: z.object({
			amount: stringWithNumberValidation(
				z.int("Enter a donation amount.").min(100, "Donation amount must be at least 100.")
			),
			comment: z.string().optional(),
			email: z.email("Enter a valid email address."),
			name: z.string().min(3, "Enter at least 3 characters."),
		}),
		data: withBaseSuccessResponse(
			z.object({
				access_code: z.string(),
				authorization_url: z.url("Enter a valid URL."),
				reference: z.string(),
			})
		),
	},

	"@post/feedback/home": {
		body: z.object({
			email: z.email("Enter a valid email address."),
			feedback: z
				.string()
				.min(10, "Enter at least 10 characters.")
				.max(500, "Keep this under 500 characters."),
		}),
		data: withBaseSuccessResponse(z.null()),
	},
});

const publicFormRoutes = defineSchemaRoutes({
	"@post/forms/ash/feedback": {
		body: z.object({
			academicImprovementNoticed: z.string().optional(),
			additionalComments: z.string().optional(),
			attendanceFrequency: z.string().min(1, "This field is required."),
			childBenefited: z.string().min(1, "This field is required."),
			confidenceBehaviorChange: z.string().optional(),
			confidenceRating: ratingSchema,
			currentClass: z.string().min(1, "This field is required."),
			enjoyedParts: z.array(z.string()).optional(),
			learningImprovementRating: ratingSchema,
			mostValuableAspects: z.array(z.string()).optional(),
			parentGuardianName: z.string().min(1, "This field is required."),
			parentGuardianRelationship: z.string().min(1, "This field is required."),
			parentImprovementSuggestions: z.string().optional(),
			parentPhone: z.string().optional(),
			parentSatisfactionRating: ratingSchema.optional(),
			programImpactOnChild: z.string().optional(),
			schoolName: z.string().min(1, "This field is required."),
			studentEnjoyedMost: z.string().optional(),
			studentFirstName: z.string().min(1, "This field is required."),
			studentImprovementSuggestions: z.string().optional(),
			studentSurname: z.string().min(1, "This field is required."),
			volunteerSupportRating: ratingSchema,
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/ash/registration": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/tacots/feedback": {
		body: z.object({
			academicImprovementNoticed: z.string().optional(),
			additionalComments: z.string().optional(),
			attitudeChangeNoticed: z.string().optional(),
			currentChallenges: z.array(z.string()).optional(),
			currentClass: z.string().min(1, "This field is required."),
			currentSchool: z.string().min(1, "This field is required."),
			likedMost: z.string().optional(),
			mentorshipImpactRating: ratingSchema,
			mostHelpfulSupport: z.array(z.string()).optional(),
			parentGuardianName: z.string().min(1, "This field is required."),
			parentGuardianRelationship: z.string().min(1, "This field is required."),
			parentImprovementSuggestions: z.string().optional(),
			parentPhone: z.string().optional(),
			parentSatisfactionRating: ratingSchema.optional(),
			programImpactOnFamily: z.string().optional(),
			scholarshipHelpedStay: z.string().min(1, "This field is required."),
			scholarshipReducedBurden: z.string().min(1, "This field is required."),
			studentFirstName: z.string().min(1, "This field is required."),
			studentImprovementSuggestions: z.string().optional(),
			studentSurname: z.string().min(1, "This field is required."),
			studyMotivationRating: ratingSchema,
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/tacots/recommendation": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/volunteer/feedback": {
		body: z.object({
			activitiesInvolvedIn: z.array(z.string()).optional(),
			additionalComments: z.string().optional(),
			challengesExperienced: z.string().optional(),
			continueVolunteering: z.string().optional(),
			enjoyedMost: z.string().optional(),
			firstName: z.string().min(1, "This field is required."),
			improvementSuggestions: z.string().optional(),
			organizationRating: ratingSchema,
			overallExperienceRating: ratingSchema,
			programMadeImpact: z.string().optional(),
			programVolunteered: z.string().min(1, "This field is required."),
			roleClarityRating: ratingSchema,
			skillsDeveloped: z.string().optional(),
			skillsGained: z.array(z.string()).optional(),
			specificProgramDetails: z.string().optional(),
			submissionDate: z.string().min(1, "This field is required."),
			surname: z.string().min(1, "This field is required."),
			teamSupportRating: ratingSchema,
			volunteerDuration: z.string().optional(),
			waysProgramHelped: z.array(z.string()).optional(),
			wouldRecommend: z.string().optional(),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/volunteer/register": {
		body: z.object({
			additionalInfo: z.string().optional(),
			age: stringWithNumberValidation(
				z.int("Enter a whole number for age.").min(16, "Volunteer must be at least 16 years old.")
			),
			ashAcademicArea: z.string().optional(),
			ashExtracurricular: z.array(z.string()).optional(),
			ashInterest: z.string().optional(),
			ashSaturdayAvailability: z.string().optional(),
			availability: z.array(z.string()).min(1, "Select at least one availability option."),
			city: z.string().min(1, "This field is required."),
			commitmentDuration: z.string().optional(),
			dob: z.string().min(1, "This field is required."),
			emailAddress: z.email("Enter a valid email address."),
			firstName: z.string().min(1, "This field is required."),
			gender: z.string().min(1, "This field is required."),
			highestEducation: z.string().optional(),
			homeAddress: z.string().min(1, "This field is required."),
			mediaConsent: z.boolean("Choose yes or no."),
			middleName: z.string().optional(),
			occupation: z.string().optional(),
			phoneNumber: z.string().min(1, "This field is required."),
			reasonForVolunteering: z.string().min(1, "This field is required."),
			registrationDate: z.string().min(1, "This field is required."),
			safeguardingAgreement: z.string().min(1, "This field is required."),
			skillsToContribute: z.array(z.string()).optional(),
			state: z.string().min(1, "This field is required."),
			surname: z.string().min(1, "This field is required."),
			volunteerAreas: z.array(z.string()).min(1, "Select at least one volunteer area."),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},
});

const protectedFormRoutes = defineSchemaRoutes({
	"@delete/forms/capacity-building/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: idParamsSchema,
	},

	"@get/forms/ash/feedback": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: paginatedQuerySchema,
	},

	"@get/forms/ash/feedback/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: idParamsSchema,
	},

	"@get/forms/ash/registration": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: paginatedQuerySchema,
	},

	"@get/forms/ash/registration/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: idParamsSchema,
	},

	"@get/forms/capacity-building": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: paginatedQuerySchema.pick({ limit: true, page: true }),
	},

	"@get/forms/capacity-building/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: idParamsSchema,
	},

	"@get/forms/tacots/feedback": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: paginatedQuerySchema,
	},

	"@get/forms/tacots/feedback/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: idParamsSchema,
	},

	"@get/forms/tacots/recommendation": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: paginatedQuerySchema,
	},

	"@get/forms/tacots/recommendation/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: idParamsSchema,
	},

	"@get/volunteer": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: paginatedQuerySchema,
	},

	"@get/volunteer/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: idParamsSchema,
	},

	"@get/volunteer/all/feedback": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: paginatedQuerySchema,
	},

	"@get/volunteer/feedback/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: idParamsSchema,
	},

	"@post/forms/capacity-building": {
		body: z.object({
			budgetAllocated: z.string().optional(),
			budgetUtilized: z.string().optional(),
			challengesAddressed: z.string().optional(),
			challengesEncountered: z.string().optional(),
			communicationAndCoordination: ratingSchema,
			dateSubmitted: z.string().min(1, "This field is required."),
			effectiveActivities: z.string().optional(),
			improvementSuggestions: z.string().optional(),
			inadequateResourcesExplanation: z.string().optional(),
			lessonsLearned: z.string().optional(),
			listOfSponsors: z.string().min(1, "This field is required."),
			location: z.string().min(1, "This field is required."),
			majorActivities: z.string().optional(),
			name: z.string().min(1, "This field is required."),
			numberOfFacilitators: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfParticipants: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfSponsors: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfVolunteers: stringWithNumberValidation(z.int("Enter a whole number.")),
			objectiveAchievement: z.string().min(1, "This field is required."),
			overallSuccess: z.string().optional(),
			participantEngagementLevel: z.string().min(1, "This field is required."),
			partnerOrganizations: z.string().optional(),
			partnershipLevel: z.string().min(1, "This field is required."),
			programCoordinator: z.string().min(1, "This field is required."),
			programDate: z.string().min(1, "This field is required."),
			programImpact: z.string().optional(),
			programName: z.string().min(1, "This field is required."),
			programObjectives: z.string().optional(),
			programOutcome: z.string().optional(),
			programType: z.string().min(1, "This field is required."),
			recommendFuturePrograms: z.string().optional(),
			recommendTheProgram: z.string().optional(),
			resourceAvailability: ratingSchema,
			role: z.string().min(1, "This field is required."),
			sponsorshipType: z.string().min(1, "This field is required."),
			targetAudience: z.string().min(1, "This field is required."),
			teamworkAmongOrganizers: ratingSchema,
			timeManagement: ratingSchema,
			venueSuitability: ratingSchema,
			wereResourcesAdequate: z.string().optional(),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},
});

export const backendApiSchema = defineSchema(
	{
		...defaultSchemaRoute,
		...authRoutes,
		...adminRoutes,
		...blogRoutes,
		...clientSideRoutes,
		...publicFormRoutes,
		...protectedFormRoutes,
	},
	{ strict: true }
);

export const backendApiSchemaRoutes = backendApiSchema.routes;

export type BackendApiRoutes = InferAllMainRoutes<typeof backendApiSchema.routes>;

export type BackendApiRouteKeys = InferAllMainRouteKeys<
	typeof backendApiSchema.routes,
	typeof backendApiSchema.config
>;
