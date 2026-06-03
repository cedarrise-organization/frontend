import type { InferAllMainRouteKeys, InferAllMainRoutes } from "@zayne-labs/callapi";
import { fallBackRouteSchemaKey } from "@zayne-labs/callapi/constants";
import { defineSchema, defineSchemaRoutes } from "@zayne-labs/callapi/utils";
import { z } from "zod";
import {
	AcademicImprovementNoticedOptions,
	AshAttendanceFrequencyOptions,
	AshChildBenefitedOptions,
	AshEnjoyedPartsOptions,
	AshFeedbackClassOptions,
	AshGuardianRelationshipOptions,
	AshHouseholdIncomeRangeOptions,
	AshLearningConditionOptions,
	AshMostValuableAspectsOptions,
	AshProgramTypeOptions,
	CapacityEngagementLevelOptions,
	CapacityObjectiveAchievementOptions,
	CapacityOverallSuccessOptions,
	CapacityPartnershipLevelOptions,
	CapacityProgramTypeOptions,
	CapacitySponsorshipTypeOptions,
	CapacityYesNoOptions,
	ClassOptions,
	GenderOptions,
	LearningConditionStatusOptions,
	NigeriaStateOptions,
	ParentGuardianRelationshipOptions,
	PositiveChangeNoticedOptions,
	PrimaryLanguageOptions,
	TacotsAnnualHouseholdIncomeOptions,
	TacotsCatholicSacramentOptions,
	TacotsCurrentChallengeOptions,
	TacotsFamilyPositionOptions,
	TacotsFeedbackClassOptions,
	TacotsGuardianRelationshipOptions,
	TacotsIncomeEarnerCountOptions,
	TacotsIncomeSourceOptions,
	TacotsLivesWithOptions,
	TacotsMostHelpfulSupportOptions,
	TacotsRecommendationReligionOptions,
	TacotsResidenceTypeOptions,
	TacotsScholarshipHelpedStayOptions,
	TacotsScholarshipReducedBurdenOptions,
	TacotsSpecialCircumstanceOptions,
	TacotsSupportTypeOptions,
	VolunteerActivityOptions,
	VolunteerAreaOptions,
	VolunteerAshAcademicAreaOptions,
	VolunteerAshExtracurricularOptions,
	VolunteerAshSaturdayAvailabilityOptions,
	VolunteerAvailabilityOptions,
	VolunteerCommitmentDurationOptions,
	VolunteerFeedbackDurationOptions,
	VolunteerFeedbackProgramOptions,
	VolunteerHighestEducationOptions,
	VolunteerProgramImpactOptions,
	VolunteerSkillDevelopedOptions,
	VolunteerSkillGainedOptions,
	VolunteerSkillOptions,
	VolunteerWaysProgramHelpedOptions,
	YesMaybeNoOptions,
	YesNoOptions,
	YesNoSometimesOptions,
} from "./constants";

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

const stringWithNumberValidation = <TNumberSchema extends z.ZodNumber>(numberSchema: TNumberSchema) => {
	return z.preprocess((value: string) => Number(value), numberSchema);
};

const ratingSchema = stringWithNumberValidation(
	z
		.int("Select a rating from 1 to 5.")
		.min(1, "Select a rating from 1 to 5.")
		.max(5, "Select a rating from 1 to 5.")
);

const requiredStringSchema = z.string().min(1, "This field is required.");

const dateStringSchema = z.iso.date("Enter a valid date.");

const requiredPhoneNumberSchema = z.union(
	[z.e164(), z.string().regex(/^0\d{10}$/)],
	"Enter a valid phone number."
);

const optionalPhoneNumberSchema = requiredPhoneNumberSchema.optional();

const requiredFileSchema = z.file("Upload a file.");

const requiredEnumSchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.enum(options, "This field is required.");
};

const optionalEnumSchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.enum(options, "Select a valid option.").optional();
};

const requiredEnumArraySchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.array(z.enum(options, "Select a valid option.")).min(1, "Select at least one option.");
};

const optionalEnumArraySchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.array(z.enum(options, "Select a valid option.")).optional();
};

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
			action: requiredEnumSchema(["assign", "revoke"]),
			rolename: requiredEnumSchema(["admin", "superadmin"]),
		}),
	},

	"@post/admin/users": {
		body: loginBodySchema.extend({
			department: requiredEnumSchema(["TACOTS", "ASH", "CAPACITY BUILDING", "OUTREACHES"]),
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
		query: z.object({ reference: requiredStringSchema }),
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
				data: z.object({
					access_code: z.string(),
					authorization_url: z.url("Enter a valid URL."),
					reference: z.string(),
				}),
				message: z.string(),
				status: z.boolean(),
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

export const AshRegisterFrontendSchema = z.object({
	age: stringWithNumberValidation(
		z.int("Enter a valid age.").min(6, "Age must be at least 6.").max(18, "Age must be 18 or below.")
	),
	assignedMentor: z.string().optional(),
	classPositionLastTerm: requiredStringSchema,
	currentClass: requiredEnumSchema(ClassOptions),
	declarationConfirmed: z.boolean().refine(Boolean, "This field is required."),
	dob: dateStringSchema,
	fathersName: requiredStringSchema,
	fathersOccupation: requiredStringSchema,
	fathersPhone: optionalPhoneNumberSchema,
	firstName: requiredStringSchema,
	gender: requiredEnumSchema(GenderOptions),
	guardianName: z.string().optional(),
	guardianOccupation: z.string().optional(),
	guardianPhone: optionalPhoneNumberSchema,
	guardianRelationship: optionalEnumSchema(AshGuardianRelationshipOptions),
	hasLearningCondition: requiredEnumSchema(LearningConditionStatusOptions),
	homeAddress: requiredStringSchema,
	householdIncomeRange: optionalEnumSchema(AshHouseholdIncomeRangeOptions),
	lastResult: requiredFileSchema,
	learningConditions: optionalEnumArraySchema(AshLearningConditionOptions),
	middleName: z.string().optional(),
	mothersName: requiredStringSchema,
	mothersOccupation: z.string().optional(),
	mothersPhone: requiredPhoneNumberSchema,
	parentConsent: z.boolean().refine(Boolean, "This field is required."),
	parentSignature: requiredFileSchema,
	passportPhoto: requiredFileSchema,
	pretestScore: z.string().optional(),
	prevAfterschoolProgram: requiredEnumSchema(YesNoOptions),
	primaryLanguage: requiredEnumSchema(PrimaryLanguageOptions),
	programType: requiredEnumSchema(AshProgramTypeOptions),
	reasonForJoining: requiredStringSchema,
	schoolLga: requiredStringSchema,
	schoolName: requiredStringSchema,
	schoolState: requiredEnumSchema(NigeriaStateOptions),
	schoolTown: requiredStringSchema,
	studentPhone: optionalPhoneNumberSchema,
	surname: requiredStringSchema,
});

export const TacotsRecommendationFrontendSchema = z.object({
	age: stringWithNumberValidation(z.int("Enter a valid age.").min(6, "Age must be at least 6.")),
	annualHouseholdIncome: requiredEnumSchema(TacotsAnnualHouseholdIncomeOptions),
	avgMonthlyIncome: z.string().optional(),
	careerGoal: requiredStringSchema,
	catholicSacraments: optionalEnumArraySchema(TacotsCatholicSacramentOptions),
	childBackgroundNotes: requiredStringSchema,
	classPositionLastTerm: requiredStringSchema,
	declarationConfirmed: z.boolean().refine(Boolean, "This field is required."),
	diocese: z.string().optional(),
	disciplineRating: ratingSchema,
	dob: dateStringSchema,
	familyPosition: requiredEnumSchema(TacotsFamilyPositionOptions),
	fathersName: requiredStringSchema,
	fathersOccupation: requiredStringSchema,
	fathersPhone: requiredPhoneNumberSchema,
	firstName: requiredStringSchema,
	gender: requiredEnumSchema(GenderOptions),
	guardianAddress: z.string().optional(),
	guardianName: z.string().optional(),
	guardianOccupation: z.string().optional(),
	guardianPhone: optionalPhoneNumberSchema,
	guardianRelationship: optionalEnumSchema(TacotsGuardianRelationshipOptions),
	hasElectricity: requiredEnumSchema(YesNoSometimesOptions),
	homeAddress: requiredStringSchema,
	householdSize: stringWithNumberValidation(
		z.int("Enter a valid household size.").min(2, "Household size must be at least 2.")
	),
	incomeSources: requiredEnumArraySchema(TacotsIncomeSourceOptions),
	lastClass: requiredEnumSchema(ClassOptions),
	lastResult: requiredFileSchema,
	lastTermAverage: z.string().optional(),
	lastYearAttended: stringWithNumberValidation(z.int("Enter a valid year.")),
	lga: requiredStringSchema,
	livesWith: requiredEnumSchema(TacotsLivesWithOptions),
	middleName: z.string().optional(),
	mothersName: requiredStringSchema,
	mothersOccupation: requiredStringSchema,
	mothersPhone: requiredPhoneNumberSchema,
	nationality: requiredStringSchema,
	numIncomeEarners: requiredEnumSchema(TacotsIncomeEarnerCountOptions),
	numSiblings: stringWithNumberValidation(
		z.int("Enter a valid number of siblings.").min(0, "Number of siblings cannot be negative.")
	),
	otherImportantInfo: z.string().optional(),
	parentsAddress: requiredStringSchema,
	parishAttended: z.string().optional(),
	passportPhoto: requiredFileSchema,
	phoneNumber: optionalPhoneNumberSchema,
	primaryLanguage: requiredEnumSchema(PrimaryLanguageOptions),
	recommenderAddress: requiredStringSchema,
	recommenderFirstName: requiredStringSchema,
	recommenderLastName: requiredStringSchema,
	recommenderPhone: requiredPhoneNumberSchema,
	religion: requiredEnumSchema(TacotsRecommendationReligionOptions),
	residenceType: requiredEnumSchema(TacotsResidenceTypeOptions),
	responsibilityRating: ratingSchema,
	schoolName: requiredStringSchema,
	schoolState: requiredEnumSchema(NigeriaStateOptions),
	schoolTown: requiredStringSchema,
	specialCircumstances: requiredEnumSchema(TacotsSpecialCircumstanceOptions),
	stateOfOrigin: requiredEnumSchema(NigeriaStateOptions),
	studentStatement: z.string().optional(),
	supportTypesNeeded: requiredEnumArraySchema(TacotsSupportTypeOptions),
	surname: requiredStringSchema,
});

const publicFormRoutes = defineSchemaRoutes({
	"@post/forms/ash/feedback": {
		body: z.object({
			academicImprovementNoticed: optionalEnumSchema(AcademicImprovementNoticedOptions),
			additionalComments: z.string().optional(),
			attendanceFrequency: requiredEnumSchema(AshAttendanceFrequencyOptions),
			childBenefited: requiredEnumSchema(AshChildBenefitedOptions),
			confidenceBehaviorChange: optionalEnumSchema(PositiveChangeNoticedOptions),
			confidenceRating: ratingSchema,
			currentClass: requiredEnumSchema(AshFeedbackClassOptions),
			enjoyedParts: optionalEnumArraySchema(AshEnjoyedPartsOptions),
			learningImprovementRating: ratingSchema,
			mostValuableAspects: optionalEnumArraySchema(AshMostValuableAspectsOptions),
			parentGuardianName: requiredStringSchema,
			parentGuardianRelationship: requiredEnumSchema(ParentGuardianRelationshipOptions),
			parentImprovementSuggestions: z.string().optional(),
			parentPhone: optionalPhoneNumberSchema,
			parentSatisfactionRating: ratingSchema.optional(),
			programImpactOnChild: z.string().optional(),
			schoolName: requiredStringSchema,
			studentEnjoyedMost: z.string().optional(),
			studentFirstName: requiredStringSchema,
			studentImprovementSuggestions: z.string().optional(),
			studentSurname: requiredStringSchema,
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
			academicImprovementNoticed: optionalEnumSchema(AcademicImprovementNoticedOptions),
			additionalComments: z.string().optional(),
			attitudeChangeNoticed: optionalEnumSchema(PositiveChangeNoticedOptions),
			currentChallenges: optionalEnumArraySchema(TacotsCurrentChallengeOptions),
			currentClass: requiredEnumSchema(TacotsFeedbackClassOptions),
			currentSchool: requiredStringSchema,
			likedMost: z.string().optional(),
			mentorshipImpactRating: ratingSchema,
			mostHelpfulSupport: optionalEnumArraySchema(TacotsMostHelpfulSupportOptions),
			parentGuardianName: requiredStringSchema,
			parentGuardianRelationship: requiredEnumSchema(ParentGuardianRelationshipOptions),
			parentImprovementSuggestions: z.string().optional(),
			parentPhone: optionalPhoneNumberSchema,
			parentSatisfactionRating: ratingSchema.optional(),
			programImpactOnFamily: z.string().optional(),
			scholarshipHelpedStay: requiredEnumSchema(TacotsScholarshipHelpedStayOptions),
			scholarshipReducedBurden: requiredEnumSchema(TacotsScholarshipReducedBurdenOptions),
			studentFirstName: requiredStringSchema,
			studentImprovementSuggestions: z.string().optional(),
			studentSurname: requiredStringSchema,
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
			activitiesInvolvedIn: optionalEnumArraySchema(VolunteerActivityOptions),
			additionalComments: z.string().optional(),
			challengesExperienced: z.string().optional(),
			continueVolunteering: optionalEnumSchema(YesMaybeNoOptions),
			enjoyedMost: z.string().optional(),
			firstName: requiredStringSchema,
			improvementSuggestions: z.string().optional(),
			organizationRating: ratingSchema,
			overallExperienceRating: ratingSchema,
			programMadeImpact: optionalEnumSchema(VolunteerProgramImpactOptions),
			programVolunteered: requiredEnumSchema(VolunteerFeedbackProgramOptions),
			roleClarityRating: ratingSchema,
			skillsDeveloped: optionalEnumSchema(VolunteerSkillDevelopedOptions),
			skillsGained: optionalEnumArraySchema(VolunteerSkillGainedOptions),
			specificProgramDetails: z.string().optional(),
			submissionDate: dateStringSchema,
			surname: requiredStringSchema,
			teamSupportRating: ratingSchema,
			volunteerDuration: optionalEnumSchema(VolunteerFeedbackDurationOptions),
			waysProgramHelped: optionalEnumArraySchema(VolunteerWaysProgramHelpedOptions),
			wouldRecommend: optionalEnumSchema(YesMaybeNoOptions),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/volunteer/register": {
		body: z.object({
			additionalInfo: z.string().optional(),
			age: stringWithNumberValidation(z.int("Enter a valid age.").min(16, "Age must be at least 16.")),
			ashAcademicArea: optionalEnumSchema(VolunteerAshAcademicAreaOptions),
			ashExtracurricular: optionalEnumArraySchema(VolunteerAshExtracurricularOptions),
			ashSaturdayAvailability: optionalEnumSchema(VolunteerAshSaturdayAvailabilityOptions),
			availability: requiredEnumArraySchema(VolunteerAvailabilityOptions),
			city: requiredStringSchema,
			commitmentDuration: optionalEnumSchema(VolunteerCommitmentDurationOptions),
			dob: dateStringSchema,
			emailAddress: z.email("Enter a valid email address."),
			firstName: requiredStringSchema,
			gender: requiredEnumSchema(GenderOptions),
			highestEducation: optionalEnumSchema(VolunteerHighestEducationOptions),
			homeAddress: requiredStringSchema,
			mediaConsent: z.boolean("Choose yes or no."),
			middleName: z.string().optional(),
			occupation: z.string().optional(),
			phoneNumber: requiredPhoneNumberSchema,
			reasonForVolunteering: requiredStringSchema,
			safeguardingAgreement: requiredEnumSchema(YesNoOptions),
			skillsToContribute: optionalEnumArraySchema(VolunteerSkillOptions),
			state: requiredEnumSchema(NigeriaStateOptions),
			surname: requiredStringSchema,
			volunteerAreas: requiredEnumArraySchema(VolunteerAreaOptions),
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
			dateSubmitted: dateStringSchema,
			effectiveActivities: z.string().optional(),
			improvementSuggestions: z.string().optional(),
			inadequateResourcesExplanation: z.string().optional(),
			lessonsLearned: z.string().optional(),
			listOfSponsors: requiredStringSchema,
			location: requiredStringSchema,
			majorActivities: z.string().optional(),
			name: requiredStringSchema,
			numberOfFacilitators: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfParticipants: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfSponsors: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfVolunteers: stringWithNumberValidation(z.int("Enter a whole number.")),
			objectiveAchievement: requiredEnumSchema(CapacityObjectiveAchievementOptions),
			overallSuccess: optionalEnumSchema(CapacityOverallSuccessOptions),
			participantEngagementLevel: requiredEnumSchema(CapacityEngagementLevelOptions),
			partnerOrganizations: z.string().optional(),
			partnershipLevel: requiredEnumSchema(CapacityPartnershipLevelOptions),
			programCoordinator: requiredStringSchema,
			programDate: dateStringSchema,
			programImpact: z.string().optional(),
			programName: requiredStringSchema,
			programObjectives: z.string().optional(),
			programOutcome: z.string().optional(),
			programType: requiredEnumSchema(CapacityProgramTypeOptions),
			recommendFuturePrograms: z.string().optional(),
			recommendTheProgram: optionalEnumSchema(CapacityYesNoOptions),
			resourceAvailability: ratingSchema,
			role: requiredStringSchema,
			sponsorshipType: requiredEnumSchema(CapacitySponsorshipTypeOptions),
			targetAudience: requiredStringSchema,
			teamworkAmongOrganizers: ratingSchema,
			timeManagement: ratingSchema,
			venueSuitability: ratingSchema,
			wereResourcesAdequate: optionalEnumSchema(CapacityYesNoOptions),
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
