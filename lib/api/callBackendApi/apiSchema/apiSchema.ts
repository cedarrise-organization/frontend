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

const optionalStringSchema = z.string().optional();

const requiredFileSchema = z.file().nullable().refine(Boolean, "Upload a file.");

const requiredEnumSchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.enum(options, "This field is required.");
};

const optionalEnumSchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.enum(options, "Select a valid option.").optional();
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
		query: z.object({ reference: requiredStringSchema }),
	},

	"@post/donate": {
		body: z.object({
			amount: stringWithNumberValidation(
				z.int("Enter a donation amount.").min(100, "Donation amount must be at least 100.")
			),
			comment: optionalStringSchema,
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

export const AshRegisterFrontendSchema = z.object({
	age: stringWithNumberValidation(
		z.int("Enter a valid age.").min(6, "Age must be at least 6.").max(18, "Age must be 18 or below.")
	),
	assignedMentor: optionalStringSchema,
	classPositionLastTerm: requiredStringSchema,
	currentClass: requiredEnumSchema(ClassOptions),
	declarationConfirmed: z.boolean().refine(Boolean, "This field is required."),
	dob: requiredStringSchema,
	fathersName: requiredStringSchema,
	fathersOccupation: requiredStringSchema,
	fathersPhone: optionalStringSchema,
	firstName: requiredStringSchema,
	gender: requiredEnumSchema(GenderOptions),
	guardianName: optionalStringSchema,
	guardianOccupation: optionalStringSchema,
	guardianPhone: optionalStringSchema,
	guardianRelationship: optionalEnumSchema(AshGuardianRelationshipOptions),
	hasLearningCondition: requiredEnumSchema(LearningConditionStatusOptions),
	homeAddress: requiredStringSchema,
	householdIncomeRange: optionalEnumSchema(AshHouseholdIncomeRangeOptions),
	lastResult: z.file().nullable(),
	learningConditions: z.array(z.enum(AshLearningConditionOptions, "Select a valid option.")).optional(),
	middleName: optionalStringSchema,
	mothersName: requiredStringSchema,
	mothersOccupation: optionalStringSchema,
	mothersPhone: requiredStringSchema,
	parentConsent: z.boolean().refine(Boolean, "This field is required."),
	parentSignature: requiredFileSchema,
	passportPhoto: requiredFileSchema,
	pretestScore: optionalStringSchema,
	prevAfterschoolProgram: requiredEnumSchema(YesNoOptions),
	primaryLanguage: requiredEnumSchema(PrimaryLanguageOptions),
	programType: requiredEnumSchema(AshProgramTypeOptions),
	reasonForJoining: requiredStringSchema,
	schoolLga: requiredStringSchema,
	schoolName: requiredStringSchema,
	schoolState: requiredEnumSchema(NigeriaStateOptions),
	schoolTown: requiredStringSchema,
	studentPhone: optionalStringSchema,
	surname: requiredStringSchema,
});

export const TacotsRecommendationFrontendSchema = z.object({
	age: stringWithNumberValidation(z.int("Enter a valid age.").min(6, "Age must be at least 6.")),
	annualHouseholdIncome: requiredEnumSchema(TacotsAnnualHouseholdIncomeOptions),
	avgMonthlyIncome: optionalStringSchema,
	careerGoal: requiredStringSchema,
	catholicSacraments: z
		.array(z.enum(TacotsCatholicSacramentOptions, "Select a valid option."))
		.optional(),
	childBackgroundNotes: requiredStringSchema,
	classPositionLastTerm: requiredStringSchema,
	declarationConfirmed: z.boolean().refine(Boolean, "This field is required."),
	diocese: optionalStringSchema,
	disciplineRating: ratingSchema,
	dob: requiredStringSchema,
	familyPosition: requiredEnumSchema(TacotsFamilyPositionOptions),
	fathersName: requiredStringSchema,
	fathersOccupation: requiredStringSchema,
	fathersPhone: requiredStringSchema,
	firstName: requiredStringSchema,
	gender: requiredEnumSchema(GenderOptions),
	guardianAddress: optionalStringSchema,
	guardianName: optionalStringSchema,
	guardianOccupation: optionalStringSchema,
	guardianPhone: optionalStringSchema,
	guardianRelationship: optionalEnumSchema(TacotsGuardianRelationshipOptions),
	hasElectricity: requiredEnumSchema(YesNoSometimesOptions),
	homeAddress: requiredStringSchema,
	householdSize: stringWithNumberValidation(
		z.int("Enter a valid household size.").min(2, "Household size must be at least 2.")
	),
	incomeSources: z
		.array(z.enum(TacotsIncomeSourceOptions, "Select a valid option."))
		.min(1, "Select at least one income source."),
	lastClass: requiredEnumSchema(ClassOptions),
	lastResult: requiredFileSchema,
	lastTermAverage: optionalStringSchema,
	lastYearAttended: stringWithNumberValidation(z.int("Enter a valid year.")),
	lga: requiredStringSchema,
	livesWith: requiredEnumSchema(TacotsLivesWithOptions),
	middleName: optionalStringSchema,
	mothersName: requiredStringSchema,
	mothersOccupation: requiredStringSchema,
	mothersPhone: requiredStringSchema,
	nationality: requiredStringSchema,
	numIncomeEarners: requiredEnumSchema(TacotsIncomeEarnerCountOptions),
	numSiblings: stringWithNumberValidation(
		z.int("Enter a valid number of siblings.").min(0, "Number of siblings cannot be negative.")
	),
	otherImportantInfo: optionalStringSchema,
	parentsAddress: requiredStringSchema,
	parishAttended: optionalStringSchema,
	passportPhoto: requiredFileSchema,
	phoneNumber: optionalStringSchema,
	primaryLanguage: requiredEnumSchema(PrimaryLanguageOptions),
	recommenderAddress: requiredStringSchema,
	recommenderFirstName: requiredStringSchema,
	recommenderLastName: requiredStringSchema,
	recommenderPhone: requiredStringSchema,
	religion: requiredEnumSchema(TacotsRecommendationReligionOptions),
	residenceType: requiredEnumSchema(TacotsResidenceTypeOptions),
	responsibilityRating: ratingSchema,
	schoolName: requiredStringSchema,
	schoolState: requiredEnumSchema(NigeriaStateOptions),
	schoolTown: requiredStringSchema,
	specialCircumstances: requiredEnumSchema(TacotsSpecialCircumstanceOptions),
	stateOfOrigin: requiredEnumSchema(NigeriaStateOptions),
	studentStatement: optionalStringSchema,
	supportTypesNeeded: z
		.array(z.enum(TacotsSupportTypeOptions, "Select a valid option."))
		.min(1, "Select at least one support type."),
	surname: requiredStringSchema,
});

const publicFormRoutes = defineSchemaRoutes({
	"@post/forms/ash/feedback": {
		body: z.object({
			academicImprovementNoticed: optionalEnumSchema(AcademicImprovementNoticedOptions),
			additionalComments: optionalStringSchema,
			attendanceFrequency: z.enum(AshAttendanceFrequencyOptions, "This field is required."),
			childBenefited: z.enum(AshChildBenefitedOptions, "This field is required."),
			confidenceBehaviorChange: optionalEnumSchema(PositiveChangeNoticedOptions),
			confidenceRating: ratingSchema,
			currentClass: z.enum(AshFeedbackClassOptions, "This field is required."),
			enjoyedParts: z.array(z.enum(AshEnjoyedPartsOptions, "Select a valid option.")).optional(),
			learningImprovementRating: ratingSchema,
			mostValuableAspects: z
				.array(z.enum(AshMostValuableAspectsOptions, "Select a valid option."))
				.optional(),
			parentGuardianName: requiredStringSchema,
			parentGuardianRelationship: z.enum(ParentGuardianRelationshipOptions, "This field is required."),
			parentImprovementSuggestions: optionalStringSchema,
			parentPhone: optionalStringSchema,
			parentSatisfactionRating: ratingSchema.optional(),
			programImpactOnChild: optionalStringSchema,
			schoolName: requiredStringSchema,
			studentEnjoyedMost: optionalStringSchema,
			studentFirstName: requiredStringSchema,
			studentImprovementSuggestions: optionalStringSchema,
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
			additionalComments: optionalStringSchema,
			attitudeChangeNoticed: optionalEnumSchema(PositiveChangeNoticedOptions),
			currentChallenges: z
				.array(z.enum(TacotsCurrentChallengeOptions, "Select a valid option."))
				.optional(),
			currentClass: z.enum(TacotsFeedbackClassOptions, "This field is required."),
			currentSchool: requiredStringSchema,
			likedMost: optionalStringSchema,
			mentorshipImpactRating: ratingSchema,
			mostHelpfulSupport: z
				.array(z.enum(TacotsMostHelpfulSupportOptions, "Select a valid option."))
				.optional(),
			parentGuardianName: requiredStringSchema,
			parentGuardianRelationship: z.enum(ParentGuardianRelationshipOptions, "This field is required."),
			parentImprovementSuggestions: optionalStringSchema,
			parentPhone: optionalStringSchema,
			parentSatisfactionRating: ratingSchema.optional(),
			programImpactOnFamily: optionalStringSchema,
			scholarshipHelpedStay: z.enum(TacotsScholarshipHelpedStayOptions, "This field is required."),
			scholarshipReducedBurden: z.enum(
				TacotsScholarshipReducedBurdenOptions,
				"This field is required."
			),
			studentFirstName: requiredStringSchema,
			studentImprovementSuggestions: optionalStringSchema,
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
			activitiesInvolvedIn: z
				.array(z.enum(VolunteerActivityOptions, "Select a valid option."))
				.optional(),
			additionalComments: optionalStringSchema,
			challengesExperienced: optionalStringSchema,
			continueVolunteering: optionalEnumSchema(YesMaybeNoOptions),
			enjoyedMost: optionalStringSchema,
			firstName: requiredStringSchema,
			improvementSuggestions: optionalStringSchema,
			organizationRating: ratingSchema,
			overallExperienceRating: ratingSchema,
			programMadeImpact: optionalEnumSchema(VolunteerProgramImpactOptions),
			programVolunteered: z.enum(VolunteerFeedbackProgramOptions, "This field is required."),
			roleClarityRating: ratingSchema,
			skillsDeveloped: optionalEnumSchema(VolunteerSkillDevelopedOptions),
			skillsGained: z.array(z.enum(VolunteerSkillGainedOptions, "Select a valid option.")).optional(),
			specificProgramDetails: optionalStringSchema,
			submissionDate: requiredStringSchema,
			surname: requiredStringSchema,
			teamSupportRating: ratingSchema,
			volunteerDuration: optionalEnumSchema(VolunteerFeedbackDurationOptions),
			waysProgramHelped: z
				.array(z.enum(VolunteerWaysProgramHelpedOptions, "Select a valid option."))
				.optional(),
			wouldRecommend: optionalEnumSchema(YesMaybeNoOptions),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/volunteer/register": {
		body: z.object({
			additionalInfo: optionalStringSchema,
			age: stringWithNumberValidation(z.int("Enter a valid age.").min(16, "Age must be at least 16.")),
			ashAcademicArea: optionalEnumSchema(VolunteerAshAcademicAreaOptions),
			ashExtracurricular: z
				.array(z.enum(VolunteerAshExtracurricularOptions, "Select a valid option."))
				.optional(),
			ashInterest: optionalEnumSchema(YesNoOptions),
			ashSaturdayAvailability: optionalEnumSchema(VolunteerAshSaturdayAvailabilityOptions),
			availability: z
				.array(z.enum(VolunteerAvailabilityOptions, "Select a valid option."))
				.min(1, "Select at least one availability option."),
			city: requiredStringSchema,
			commitmentDuration: optionalEnumSchema(VolunteerCommitmentDurationOptions),
			dob: requiredStringSchema,
			emailAddress: z.email("Enter a valid email address."),
			firstName: requiredStringSchema,
			gender: z.enum(GenderOptions, "This field is required."),
			highestEducation: optionalEnumSchema(VolunteerHighestEducationOptions),
			homeAddress: requiredStringSchema,
			mediaConsent: z.boolean("Choose yes or no."),
			middleName: optionalStringSchema,
			occupation: optionalStringSchema,
			phoneNumber: requiredStringSchema,
			reasonForVolunteering: requiredStringSchema,
			registrationDate: requiredStringSchema,
			safeguardingAgreement: z.enum(YesNoOptions, "This field is required."),
			skillsToContribute: z.array(z.enum(VolunteerSkillOptions, "Select a valid option.")).optional(),
			state: z.enum(NigeriaStateOptions, "This field is required."),
			surname: requiredStringSchema,
			volunteerAreas: z
				.array(z.enum(VolunteerAreaOptions, "Select a valid option."))
				.min(1, "Select at least one volunteer area."),
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
			budgetAllocated: optionalStringSchema,
			budgetUtilized: optionalStringSchema,
			challengesAddressed: optionalStringSchema,
			challengesEncountered: optionalStringSchema,
			communicationAndCoordination: ratingSchema,
			dateSubmitted: requiredStringSchema,
			effectiveActivities: optionalStringSchema,
			improvementSuggestions: optionalStringSchema,
			inadequateResourcesExplanation: optionalStringSchema,
			lessonsLearned: optionalStringSchema,
			listOfSponsors: requiredStringSchema,
			location: requiredStringSchema,
			majorActivities: optionalStringSchema,
			name: requiredStringSchema,
			numberOfFacilitators: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfParticipants: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfSponsors: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfVolunteers: stringWithNumberValidation(z.int("Enter a whole number.")),
			objectiveAchievement: z.enum(CapacityObjectiveAchievementOptions, "This field is required."),
			overallSuccess: optionalEnumSchema(CapacityOverallSuccessOptions),
			participantEngagementLevel: z.enum(CapacityEngagementLevelOptions, "This field is required."),
			partnerOrganizations: optionalStringSchema,
			partnershipLevel: z.enum(CapacityPartnershipLevelOptions, "This field is required."),
			programCoordinator: requiredStringSchema,
			programDate: requiredStringSchema,
			programImpact: optionalStringSchema,
			programName: requiredStringSchema,
			programObjectives: optionalStringSchema,
			programOutcome: optionalStringSchema,
			programType: z.enum(CapacityProgramTypeOptions, "This field is required."),
			recommendFuturePrograms: optionalStringSchema,
			recommendTheProgram: optionalEnumSchema(CapacityYesNoOptions),
			resourceAvailability: ratingSchema,
			role: requiredStringSchema,
			sponsorshipType: z.enum(CapacitySponsorshipTypeOptions, "This field is required."),
			targetAudience: requiredStringSchema,
			teamworkAmongOrganizers: ratingSchema,
			timeManagement: ratingSchema,
			venueSuitability: ratingSchema,
			wereResourcesAdequate: z.enum(CapacityYesNoOptions).optional(),
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
