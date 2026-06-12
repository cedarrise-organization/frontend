import type { InferAllMainRouteKeys, InferAllMainRoutes } from "@zayne-labs/callapi";
import { fallBackRouteSchemaKey } from "@zayne-labs/callapi/constants";
import { defineSchema, defineSchemaRoutes } from "@zayne-labs/callapi/utils";
import { z } from "zod";
import {
	AcademicImprovementNoticedOptions,
	AcademicSessionOptions,
	AdminDepartmentOptions,
	AdminReviewStatusOptions,
	AdminRoleActionOptions,
	AdminRoleNameOptions,
	AshAreasOfImprovementOptions,
	AshAttendanceFrequencyOptions,
	AshChildBenefitedOptions,
	AshEnjoyedPartsOptions,
	AshExitDurationOptions,
	AshExitReasonOptions,
	AshFeedbackClassOptions,
	AshGuardianRelationshipOptions,
	AshHouseholdIncomeRangeOptions,
	AshLearningConditionOptions,
	AshMentorshipReceivedOptions,
	AshMostValuableAspectsOptions,
	AshPostExitStatusOptions,
	AshProgramTypeOptions,
	AshSessionConductedOptions,
	AshTermOptions,
	AshTrackingSortByOptions,
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
	OutreachTypeOptions,
	ParentGuardianRelationshipOptions,
	PositiveChangeNoticedOptions,
	PrimaryLanguageOptions,
	ProjectStatusOptions,
	ReviewStatusOptions,
	TacotsAcademicTermOptions,
	TacotsAnnualHouseholdIncomeOptions,
	TacotsAssessmentPeriodOptions,
	TacotsCatholicSacramentOptions,
	TacotsCurrentChallengeOptions,
	TacotsExitCompletedSecondaryElsewhereOptions,
	TacotsExitCurrentStatusOptions,
	TacotsExitReasonOptions,
	TacotsFamilyPositionOptions,
	TacotsFeedbackClassOptions,
	TacotsGuardianRelationshipOptions,
	TacotsHighestEducationAttainedOptions,
	TacotsIncomeEarnerCountOptions,
	TacotsIncomeSourceOptions,
	TacotsLivesWithOptions,
	TacotsMentorshipModeOptions,
	TacotsMostHelpfulSupportOptions,
	TacotsRecommendationReligionOptions,
	TacotsRecommendationSortByOptions,
	TacotsResidenceTypeOptions,
	TacotsScholarshipHelpedStayOptions,
	TacotsScholarshipReducedBurdenOptions,
	TacotsSpecialCircumstanceOptions,
	TacotsSupportTypeOptions,
	TacotsVocationalSkillOptions,
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
	VolunteerSortByOptions,
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

const getRatingSchema = (maxRating: 10 | 5 = 5) => {
	const message = `Select a rating from 1 to ${maxRating}.`;

	return stringWithNumberValidation(z.int(message).min(1, message).max(maxRating, message));
};

const RequiredStringSchema = z.string().min(1, "This field is required.");

const DateStringSchema = z.iso.date("Enter a valid date.");

const RequiredPhoneNumberSchema = z.union([
	z.e164("Enter a valid phone number."),
	z.string().regex(/^0\d{10}$/, "Enter a valid phone number."),
]);

const OptionalPhoneNumberSchema = RequiredPhoneNumberSchema.optional();

const RequiredFileSchema = z.file("Upload a file.");

const getRequiredEnumSchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.enum(options, "This field is required.");
};

const getOptionalEnumSchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.enum(options, "Select a valid option.").optional();
};

const getRequiredEnumArraySchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.array(z.enum(options, "Select a valid option.")).min(1, "Select at least one option.");
};

const getOptionalEnumArraySchema = <const TOptions extends readonly string[]>(options: TOptions) => {
	return z.array(z.enum(options, "Select a valid option.")).optional();
};

const PaginatedQuerySchema = z
	.object({
		limit: z.number("Enter a valid limit."),
		page: z.number("Enter a valid page."),
		search: z.string(),
	})
	.partial();

const IdParamsSchema = z.object({
	id: z.uuid("Invalid ID."),
});

const UserIdParamsSchema = z.object({
	userId: z.uuid("Invalid ID."),
});

const ReviewStatusQuerySchema = z.object({
	status: getRequiredEnumSchema(ReviewStatusOptions),
});

const AdminReviewStatusQuerySchema = z.object({
	status: getRequiredEnumSchema(AdminReviewStatusOptions),
});

const GalleryPhotoSchema = z.object({
	public_id: z.string(),
	url: z.url("Enter a valid URL."),
});

const BlogSchema = z.object({
	date: z.string(),
	description: z.string().nullable().optional(),
	documentUrl: z.url("Enter a valid URL."),
	id: z.uuid("Invalid ID."),
	publicId: z.string(),
	title: z.string(),
});

const AuthUserSchema = z.object({
	createdAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	department: z.string(),
	email: z.email("Enter a valid email address."),
	id: z.uuid("Invalid ID."),
	name: z.string(),
	password: z.string().optional(),
	updatedAt: z.string().nullable().optional(),
});

const SessionUserSchema = AuthUserSchema.pick({
	department: true,
	id: true,
	name: true,
}).partial({
	department: true,
	name: true,
});

const LoginSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

const LookupItemSchema = z.object({
	id: z.string(),
	name: z.string(),
});

const ProjectSchema = z.object({
	createdAt: z.string().optional(),
	description: z.string().nullable().optional(),
	id: z.uuid("Invalid ID."),
	imagePublicId: z.string().nullable().optional(),
	imageUrl: z.url("Enter a valid URL.").nullable().optional(),
	status: getRequiredEnumSchema(ProjectStatusOptions),
	title: z.string(),
	updatedAt: z.string().nullable().optional(),
});

const defaultSchemaRoute = defineSchemaRoutes({
	[fallBackRouteSchemaKey]: {
		errorData: withBaseErrorResponse(),
	},
});

const authRoutes = defineSchemaRoutes({
	"@get/auth/session": {
		data: withBaseSuccessResponse(SessionUserSchema),
	},

	"@post/auth/login": {
		body: LoginSchema,
		data: withBaseSuccessResponse(AuthUserSchema),
	},

	"@post/auth/logout": {
		data: withBaseSuccessResponse(z.null()),
	},
});

const adminRoutes = defineSchemaRoutes({
	"@delete/admin/users/:userId": {
		data: withBaseSuccessResponse(z.null()),
		params: UserIdParamsSchema,
	},

	"@get/admin/roles": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
	},

	"@get/admin/roles/:userId": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		params: UserIdParamsSchema,
	},

	"@get/admin/users": {
		data: withBaseSuccessResponse(z.array(AuthUserSchema)),
	},

	"@patch/admin/roles/:userId/action": {
		data: withBaseSuccessResponse(z.unknown()),
		params: UserIdParamsSchema,
		query: z.object({
			action: getRequiredEnumSchema(AdminRoleActionOptions),
			rolename: getRequiredEnumSchema(AdminRoleNameOptions),
		}),
	},

	"@post/admin/users": {
		body: LoginSchema.extend({
			department: getRequiredEnumSchema(AdminDepartmentOptions),
			name: z.string().min(3, "Enter at least 3 characters."),
		}),
		data: withBaseSuccessResponse(AuthUserSchema),
	},
});

const blogRoutes = defineSchemaRoutes({
	"@delete/blogs/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@get/blogs": {
		data: withBaseSuccessResponse(z.array(BlogSchema)),
		query: PaginatedQuerySchema.pick({ limit: true, page: true }),
	},

	"@get/blogs/:id": {
		data: withBaseSuccessResponse(BlogSchema),
		params: IdParamsSchema,
	},

	"@patch/blogs/:id": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@post/blogs": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(BlogSchema),
	},
});

const clientSideRoutes = defineSchemaRoutes({
	"@get/carousels/ash": {
		data: withBaseSuccessResponse(z.array(GalleryPhotoSchema)),
		query: PaginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/capacity-building": {
		data: withBaseSuccessResponse(z.array(GalleryPhotoSchema)),
		query: PaginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/outreaches": {
		data: withBaseSuccessResponse(z.array(GalleryPhotoSchema)),
		query: PaginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/tacots": {
		data: withBaseSuccessResponse(z.array(GalleryPhotoSchema)),
		query: PaginatedQuerySchema.pick({ limit: true }).optional(),
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

const DashboardChartDatasetSchema = z.object({
	datasets: z.array(
		z.object({
			data: z.array(z.number()),
			label: z.string().optional(),
		})
	),
	labels: z.array(z.string()),
	type: z.enum(["bar", "line", "doughnut", "pie"]),
});

const DashboardLineDataSchema = z.array(
	z.object({
		amount: z.number(),
		title: z.string(),
	})
);

const DashboardCardsSchema = z.object({
	ash: z.object({
		communitiesEngaged: z.number(),
		currentBeneficiaries: z.number(),
		dropOuts: z.number(),
		graduated: z.number(),
		improvedGrades: z.number(),
		studentsEnrolled: z.number(),
		volunteers: z.number(),
	}),
	capacityBuilding: z.object({
		organizationsPartneredWith: z.number(),
		participantsImpacted: z.number(),
		volunteersEngaged: z.number(),
		workshopsConducted: z.number(),
	}),
	outreaches: z.object({
		beneficiariesReached: z.number(),
		communitiesEngaged: z.number(),
		outreachEvents: z.number(),
		partners: z.number(),
		volunteers: z.number(),
	}),
	tacots: z.object({
		benefactors: z.number(),
		currentlyInSchools: z.number(),
		enrolled: z.number(),
		graduated: z.number(),
		partners: z.number(),
		partnerSchools: z.number(),
		sponsors: z.number(),
	}),
	volunteer: z.object({
		accepted: z.number(),
		applied: z.number(),
		currentVolunteers: z.number(),
		Partners: z.number(),
		sponsors: z.number(),
	}),
});

const StudentPerformanceMetricsSchema = z.object({
	c_attendanceTrend: DashboardChartDatasetSchema,
	c_dropoutTrend: DashboardChartDatasetSchema,
	c_graduationRate: DashboardChartDatasetSchema,
	c_risk: DashboardChartDatasetSchema,
	c_testScores: DashboardChartDatasetSchema,
});

const EnrollmentMetricsSchema = z.object({
	c_acceptanceRate: DashboardLineDataSchema,
	c_applicationNumbers: DashboardChartDatasetSchema,
	c_classDistribution: DashboardChartDatasetSchema,
	c_genderDiversity: DashboardChartDatasetSchema,
	c_geographicalDistribution: DashboardLineDataSchema,
});

const InstitutionalEffectivenessMetricsSchema = z.object({
	c_averageMentorshipHours: DashboardChartDatasetSchema,
	c_communityServiceHours: DashboardChartDatasetSchema,
	c_spendPerstudent: DashboardChartDatasetSchema,
	c_studentBenchMark: DashboardChartDatasetSchema,
	c_totalAccHours: DashboardLineDataSchema,
});

export type DashboardChartDataset = z.infer<typeof DashboardChartDatasetSchema>;
export type DashboardLineData = z.infer<typeof DashboardLineDataSchema>;

const dashboardRoutes = defineSchemaRoutes({
	"@get/dashboard/cards": {
		data: withBaseSuccessResponse(DashboardCardsSchema),
	},

	"@get/dashboard/enrollment": {
		data: withBaseSuccessResponse(EnrollmentMetricsSchema),
	},

	"@get/dashboard/institutional-effectiveness": {
		data: withBaseSuccessResponse(InstitutionalEffectivenessMetricsSchema),
	},

	"@get/dashboard/student-performance": {
		data: withBaseSuccessResponse(StudentPerformanceMetricsSchema),
	},
});

const generalRoutes = defineSchemaRoutes({
	"@delete/general/projects/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@get/general/projects": {
		data: withBaseSuccessResponse(z.array(ProjectSchema)),
	},

	"@patch/general/projects/:id": {
		data: withBaseSuccessResponse(ProjectSchema),
		params: IdParamsSchema,
		query: z.object({
			status: getRequiredEnumSchema(ProjectStatusOptions),
		}),
	},

	"@post/general/projects": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(ProjectSchema),
	},
});

const lookupRoutes = defineSchemaRoutes({
	"@get/lookup/ash-students": {
		data: withBaseSuccessResponse(z.array(LookupItemSchema)),
	},

	"@get/lookup/tacots-onboarded": {
		data: withBaseSuccessResponse(z.array(LookupItemSchema)),
	},

	"@get/lookup/tacots-recommended": {
		data: withBaseSuccessResponse(z.array(LookupItemSchema)),
	},

	"@get/lookup/volunteers": {
		data: withBaseSuccessResponse(z.array(LookupItemSchema)),
	},
});

export const AshRegisterFrontendSchema = z.object({
	age: stringWithNumberValidation(
		z.int("Enter a valid age.").min(6, "Age must be at least 6.").max(18, "Age must be 18 or below.")
	),
	assignedMentor: z.string().optional(),
	classPositionLastTerm: RequiredStringSchema,
	currentClass: getRequiredEnumSchema(ClassOptions),
	declarationConfirmed: z.literal(true, "This field is required"),
	dob: DateStringSchema,
	fathersName: RequiredStringSchema,
	fathersOccupation: RequiredStringSchema,
	fathersPhone: OptionalPhoneNumberSchema,
	firstName: RequiredStringSchema,
	gender: getRequiredEnumSchema(GenderOptions),
	guardianName: z.string().optional(),
	guardianOccupation: z.string().optional(),
	guardianPhone: OptionalPhoneNumberSchema,
	guardianRelationship: getOptionalEnumSchema(AshGuardianRelationshipOptions),
	hasLearningCondition: getRequiredEnumSchema(LearningConditionStatusOptions),
	homeAddress: RequiredStringSchema,
	householdIncomeRange: getOptionalEnumSchema(AshHouseholdIncomeRangeOptions),
	lastResult: RequiredFileSchema,
	learningConditions: getOptionalEnumArraySchema(AshLearningConditionOptions),
	middleName: z.string().optional(),
	mothersName: RequiredStringSchema,
	mothersOccupation: z.string().optional(),
	mothersPhone: RequiredPhoneNumberSchema,
	parentConsent: z.literal(true, "This field is required"),
	parentSignature: RequiredFileSchema,
	passportPhoto: RequiredFileSchema,
	pretestScore: z.string().optional(),
	prevAfterschoolProgram: getRequiredEnumSchema(YesNoOptions),
	primaryLanguage: getRequiredEnumSchema(PrimaryLanguageOptions),
	programType: getRequiredEnumSchema(AshProgramTypeOptions),
	reasonForJoining: RequiredStringSchema,
	schoolLga: RequiredStringSchema,
	schoolName: RequiredStringSchema,
	schoolState: getRequiredEnumSchema(NigeriaStateOptions),
	schoolTown: RequiredStringSchema,
	studentPhone: OptionalPhoneNumberSchema,
	surname: RequiredStringSchema,
});

export const AshTermlyTrackingFrontendSchema = z.object({
	academicSession: getRequiredEnumSchema(AcademicSessionOptions),
	challengesObserved: z.string().optional(),
	disciplineRating: getRatingSchema(),
	file: z.unknown().refine(Boolean, "Required"),
	leadershipRating: getRatingSchema(),
	mentorName: RequiredStringSchema,
	midtestAverage: z.string().optional(),
	midtestLiteracyScore: z.string().optional(),
	midtestNumeracyScore: z.string().optional(),
	nextTermRecommendations: z.string().optional(),
	notableAchievements: z.string().optional(),
	posttestAverage: z.string().optional(),
	posttestLiteracyScore: z.string().optional(),
	posttestNumeracyScore: z.string().optional(),
	pretestAverage: z.string().optional(),
	pretestLiteracyScore: z.string().optional(),
	pretestNumeracyScore: z.string().optional(),
	responsibilityRating: getRatingSchema(),
	schoolAverage: z.string().optional(),
	schoolLiteracyScore: z.string().optional(),
	schoolName: RequiredStringSchema,
	schoolNumeracyScore: z.string().optional(),
	schoolPosition: z.string().optional(),
	studentId: z.uuid("Invalid ID."),
	term: getRequiredEnumSchema(AshTermOptions),
});

export const OutreachTrackerFrontendSchema = z.object({
	activityDescription: RequiredStringSchema,
	challengesEncountered: z.string().optional(),
	city: RequiredStringSchema,
	community: RequiredStringSchema,
	completedBy: RequiredStringSchema,
	impactStories: z.string().optional(),
	lga: RequiredStringSchema,
	location: getRequiredEnumSchema(NigeriaStateOptions),
	numberOfBeneficiariesReached: RequiredStringSchema,
	numberOfVolunteers: RequiredStringSchema,
	outreachEndDate: DateStringSchema,
	outreachStartDate: DateStringSchema,
	outreachTypes: getRequiredEnumArraySchema(OutreachTypeOptions),
	recommendations: z.string().optional(),
	submissionDate: DateStringSchema,
});

export const TacotsRecommendationFrontendSchema = z.object({
	age: stringWithNumberValidation(z.int("Enter a valid age.").min(6, "Age must be at least 6.")),
	annualHouseholdIncome: getRequiredEnumSchema(TacotsAnnualHouseholdIncomeOptions),
	avgMonthlyIncome: z.string().optional(),
	careerGoal: RequiredStringSchema,
	catholicSacraments: getOptionalEnumArraySchema(TacotsCatholicSacramentOptions),
	childBackgroundNotes: RequiredStringSchema,
	classPositionLastTerm: RequiredStringSchema,
	declarationConfirmed: z.literal(true, "This field is required"),
	diocese: z.string().optional(),
	disciplineRating: getRatingSchema(),
	dob: DateStringSchema,
	familyPosition: getRequiredEnumSchema(TacotsFamilyPositionOptions),
	fathersName: RequiredStringSchema,
	fathersOccupation: RequiredStringSchema,
	fathersPhone: RequiredPhoneNumberSchema,
	firstName: RequiredStringSchema,
	gender: getRequiredEnumSchema(GenderOptions),
	guardianAddress: z.string().optional(),
	guardianName: z.string().optional(),
	guardianOccupation: z.string().optional(),
	guardianPhone: OptionalPhoneNumberSchema,
	guardianRelationship: getOptionalEnumSchema(TacotsGuardianRelationshipOptions),
	hasElectricity: getRequiredEnumSchema(YesNoSometimesOptions),
	homeAddress: RequiredStringSchema,
	householdSize: stringWithNumberValidation(
		z.int("Enter a valid household size.").min(2, "Household size must be at least 2.")
	),
	incomeSources: getRequiredEnumArraySchema(TacotsIncomeSourceOptions),
	lastClass: getRequiredEnumSchema(ClassOptions),
	lastResult: RequiredFileSchema,
	lastTermAverage: z.string().optional(),
	lastYearAttended: stringWithNumberValidation(z.int("Enter a valid year.")),
	lga: RequiredStringSchema,
	livesWith: getRequiredEnumSchema(TacotsLivesWithOptions),
	middleName: z.string().optional(),
	mothersName: RequiredStringSchema,
	mothersOccupation: RequiredStringSchema,
	mothersPhone: RequiredPhoneNumberSchema,
	nationality: RequiredStringSchema,
	numIncomeEarners: getRequiredEnumSchema(TacotsIncomeEarnerCountOptions),
	numSiblings: stringWithNumberValidation(
		z.int("Enter a valid number of siblings.").min(0, "Number of siblings cannot be negative.")
	),
	otherImportantInfo: z.string().optional(),
	parentsAddress: RequiredStringSchema,
	parishAttended: z.string().optional(),
	passportPhoto: RequiredFileSchema,
	phoneNumber: OptionalPhoneNumberSchema,
	primaryLanguage: getRequiredEnumSchema(PrimaryLanguageOptions),
	recommenderAddress: RequiredStringSchema,
	recommenderFirstName: RequiredStringSchema,
	recommenderLastName: RequiredStringSchema,
	recommenderPhone: RequiredPhoneNumberSchema,
	religion: getRequiredEnumSchema(TacotsRecommendationReligionOptions),
	residenceType: getRequiredEnumSchema(TacotsResidenceTypeOptions),
	responsibilityRating: getRatingSchema(),
	schoolName: RequiredStringSchema,
	schoolState: getRequiredEnumSchema(NigeriaStateOptions),
	schoolTown: RequiredStringSchema,
	specialCircumstances: getRequiredEnumSchema(TacotsSpecialCircumstanceOptions),
	stateOfOrigin: getRequiredEnumSchema(NigeriaStateOptions),
	studentStatement: z.string().optional(),
	supportTypesNeeded: getRequiredEnumArraySchema(TacotsSupportTypeOptions),
	surname: RequiredStringSchema,
});

export const TacotsStudentTrackingFrontendSchema = z.object({
	academicComment: z.string().optional(),
	academicSession: RequiredStringSchema,
	adherenceToSchoolRules: getRatingSchema(),
	assessmentPeriod: getRequiredEnumSchema(TacotsAssessmentPeriodOptions),
	briefMentoringSessionNotes: z.string().optional(),
	communityServiceComment: z.string().optional(),
	currentClass: getRequiredEnumSchema(ClassOptions),
	currentSchool: RequiredStringSchema,
	dateOfActivity: z.string().optional(),
	dateOfSubmission: DateStringSchema,
	descriptionOfActivity: z.string().optional(),
	financialNotes: z.string().optional(),
	highestSubjectScore: z.string().optional(),
	locationOfActivity: z.string().optional(),
	lowestSubjectScore: z.string().optional(),
	mentorName: z.string().optional(),
	mentorshipSessionDate: z.string().optional(),
	modeOfMentorship: getOptionalEnumSchema(TacotsMentorshipModeOptions),
	resourcesGiven: z.string().optional(),
	resultSheet: z.unknown().optional(),
	schoolFormationComment: z.string().optional(),
	senseOfResponsibility: getRatingSchema(),
	socialBehavior: getRatingSchema(),
	studentId: z.uuid("Invalid ID."),
	studentPositionInClass: z.string().optional(),
	subjectsAverage: z.string().optional(),
	sundries: z.string().optional(),
	supervisorFacilitator: z.string().optional(),
	term: getRequiredEnumSchema(TacotsAcademicTermOptions),
	totalAmountSpentForTerm: z.string().optional(),
	tuitionFeePaid: z.string().optional(),
	typeOfServiceActivity: z.string().optional(),
	uploadPaymentEvidence: z.unknown().optional(),
});

export const TacotsOnboardingFrontendSchema = z.object({
	academicDifficulties: z.string().optional(),
	acceptanceConfirmed: z.boolean("Choose yes or no"),
	additionalNotes: z.string().optional(),
	angerManagement: z.string().optional(),
	attendanceRegularity: getRatingSchema(),
	behavioralIssues: z.string().optional(),
	chronicIllness: z.string().optional(),
	currentClass: getRequiredEnumSchema(ClassOptions),
	currentSchool: RequiredStringSchema,
	dateOfOnboarding: DateStringSchema,
	dentalProblem: z.string().optional(),
	developmentalConcerns: z.string().optional(),
	disabilityOrSpecialNeeds: z.string().optional(),
	familyChallenges: z.string().optional(),
	guardianSignature: z.unknown().optional(),
	hearingProblem: z.string().optional(),
	immunizationUpToDate: z.string().optional(),
	learningDifficulties: z.string().optional(),
	localGovernmentArea: RequiredStringSchema,
	lowSelfEsteem: z.string().optional(),
	mentalHealthNotes: z.string().optional(),
	mentalHealthRating: getRatingSchema(10).optional(),
	moodSwings: z.string().optional(),
	nutritionStatus: z.string().optional(),
	parentSignature: z.unknown().optional(),
	passportPhoto: z.unknown().optional(),
	physicalActivityLevel: z.string().optional(),
	physicalConcernAffectsSchool: z.string().optional(),
	physicalHealthNotes: z.string().optional(),
	physicalHealthRating: getRatingSchema(10).optional(),
	programOfficerName: RequiredStringSchema,
	recentHospitalization: z.string().optional(),
	recommendedStudentId: z.uuid("Invalid ID."),
	referralRecommended: z.string().optional(),
	schoolEnrollmentDate: DateStringSchema,
	schoolFeeRange: z.string().optional(),
	schoolFeesPaid: z.string().optional(),
	socialChallenges: z.string().optional(),
	sponsorName: z.string().optional(),
	state: RequiredStringSchema,
	studentCurrentSituation: z.string().optional(),
	studentDeclarationAccepted: z.boolean("Choose yes or no."),
	supportRequired: z.string().optional(),
	supportType: z.string().optional(),
	termsAccepted: z.boolean("Choose yes or no."),
	uploadRecommendationLetter: z.unknown().optional(),
	witnessName: z.string().optional(),
});

const publicFormRoutes = defineSchemaRoutes({
	"@post/forms/ash/feedback": {
		body: z.object({
			academicImprovementNoticed: getOptionalEnumSchema(AcademicImprovementNoticedOptions),
			additionalComments: z.string().optional(),
			attendanceFrequency: getRequiredEnumSchema(AshAttendanceFrequencyOptions),
			childBenefited: getRequiredEnumSchema(AshChildBenefitedOptions),
			confidenceBehaviorChange: getOptionalEnumSchema(PositiveChangeNoticedOptions),
			confidenceRating: getRatingSchema(),
			currentClass: getRequiredEnumSchema(AshFeedbackClassOptions),
			enjoyedParts: getOptionalEnumArraySchema(AshEnjoyedPartsOptions),
			learningImprovementRating: getRatingSchema(),
			mostValuableAspects: getOptionalEnumArraySchema(AshMostValuableAspectsOptions),
			parentGuardianName: RequiredStringSchema,
			parentGuardianRelationship: getRequiredEnumSchema(ParentGuardianRelationshipOptions),
			parentImprovementSuggestions: z.string().optional(),
			parentPhone: OptionalPhoneNumberSchema,
			parentSatisfactionRating: getRatingSchema().optional(),
			programImpactOnChild: z.string().optional(),
			schoolName: RequiredStringSchema,
			studentEnjoyedMost: z.string().optional(),
			studentFirstName: RequiredStringSchema,
			studentImprovementSuggestions: z.string().optional(),
			studentSurname: RequiredStringSchema,
			volunteerSupportRating: getRatingSchema(),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/ash/registration": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/tacots/feedback": {
		body: z.object({
			academicImprovementNoticed: getOptionalEnumSchema(AcademicImprovementNoticedOptions),
			additionalComments: z.string().optional(),
			attitudeChangeNoticed: getOptionalEnumSchema(PositiveChangeNoticedOptions),
			currentChallenges: getOptionalEnumArraySchema(TacotsCurrentChallengeOptions),
			currentClass: getRequiredEnumSchema(TacotsFeedbackClassOptions),
			currentSchool: RequiredStringSchema,
			likedMost: z.string().optional(),
			mentorshipImpactRating: getRatingSchema(),
			mostHelpfulSupport: getOptionalEnumArraySchema(TacotsMostHelpfulSupportOptions),
			parentGuardianName: RequiredStringSchema,
			parentGuardianRelationship: getRequiredEnumSchema(ParentGuardianRelationshipOptions),
			parentImprovementSuggestions: z.string().optional(),
			parentPhone: OptionalPhoneNumberSchema,
			parentSatisfactionRating: getRatingSchema().optional(),
			programImpactOnFamily: z.string().optional(),
			scholarshipHelpedStay: getRequiredEnumSchema(TacotsScholarshipHelpedStayOptions),
			scholarshipReducedBurden: getRequiredEnumSchema(TacotsScholarshipReducedBurdenOptions),
			studentFirstName: RequiredStringSchema,
			studentImprovementSuggestions: z.string().optional(),
			studentSurname: RequiredStringSchema,
			studyMotivationRating: getRatingSchema(),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/tacots/recommendation": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/volunteer/feedback": {
		body: z.object({
			activitiesInvolvedIn: getOptionalEnumArraySchema(VolunteerActivityOptions),
			additionalComments: z.string().optional(),
			challengesExperienced: z.string().optional(),
			continueVolunteering: getOptionalEnumSchema(YesMaybeNoOptions),
			enjoyedMost: z.string().optional(),
			firstName: RequiredStringSchema,
			improvementSuggestions: z.string().optional(),
			organizationRating: getRatingSchema(),
			overallExperienceRating: getRatingSchema(),
			programMadeImpact: getOptionalEnumSchema(VolunteerProgramImpactOptions),
			programVolunteered: getRequiredEnumSchema(VolunteerFeedbackProgramOptions),
			roleClarityRating: getRatingSchema(),
			skillsDeveloped: getOptionalEnumSchema(VolunteerSkillDevelopedOptions),
			skillsGained: getOptionalEnumArraySchema(VolunteerSkillGainedOptions),
			specificProgramDetails: z.string().optional(),
			submissionDate: DateStringSchema,
			surname: RequiredStringSchema,
			teamSupportRating: getRatingSchema(),
			volunteerDuration: getOptionalEnumSchema(VolunteerFeedbackDurationOptions),
			waysProgramHelped: getOptionalEnumArraySchema(VolunteerWaysProgramHelpedOptions),
			wouldRecommend: getOptionalEnumSchema(YesMaybeNoOptions),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/volunteer/register": {
		body: z.object({
			additionalInfo: z.string().optional(),
			age: stringWithNumberValidation(z.int("Enter a valid age.").min(16, "Age must be at least 16.")),
			ashAcademicArea: getOptionalEnumSchema(VolunteerAshAcademicAreaOptions),
			ashExtracurricular: getOptionalEnumArraySchema(VolunteerAshExtracurricularOptions),
			ashSaturdayAvailability: getOptionalEnumSchema(VolunteerAshSaturdayAvailabilityOptions),
			availability: getRequiredEnumArraySchema(VolunteerAvailabilityOptions),
			city: RequiredStringSchema,
			commitmentDuration: getOptionalEnumSchema(VolunteerCommitmentDurationOptions),
			dob: DateStringSchema,
			emailAddress: z.email("Enter a valid email address."),
			firstName: RequiredStringSchema,
			gender: getRequiredEnumSchema(GenderOptions),
			highestEducation: getOptionalEnumSchema(VolunteerHighestEducationOptions),
			homeAddress: RequiredStringSchema,
			mediaConsent: z.boolean("Choose yes or no."),
			middleName: z.string().optional(),
			occupation: z.string().optional(),
			phoneNumber: RequiredPhoneNumberSchema,
			reasonForVolunteering: RequiredStringSchema,
			safeguardingAgreement: getRequiredEnumSchema(YesNoOptions),
			skillsToContribute: getOptionalEnumArraySchema(VolunteerSkillOptions),
			state: getRequiredEnumSchema(NigeriaStateOptions),
			surname: RequiredStringSchema,
			volunteerAreas: getRequiredEnumArraySchema(VolunteerAreaOptions),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},
});

const protectedFormRoutes = defineSchemaRoutes({
	"@delete/forms/ash/attendance/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/ash/exit/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/ash/registration/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/ash/tracking/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/capacity-building/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/outreaches/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/exit/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/feedback/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/onboarding/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/recommendation/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/tracking/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/volunteer/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@delete/volunteer/feedback/:id": {
		data: withBaseSuccessResponse(z.null()),
		params: IdParamsSchema,
	},

	"@get/forms/ash/attendance": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/ash/attendance/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/ash/exit": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/ash/exit/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/ash/feedback": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/ash/feedback/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/ash/registration": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(AshTrackingSortByOptions),
			status: getOptionalEnumSchema(ReviewStatusOptions),
		}),
	},

	"@get/forms/ash/registration/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/ash/tracking": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema.extend({
			academicSession: getOptionalEnumSchema(AcademicSessionOptions),
			term: getOptionalEnumSchema(AshTermOptions),
		}),
	},

	"@get/forms/ash/tracking/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/capacity-building": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/capacity-building/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/outreaches": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/outreaches/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/exit": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/tacots/exit/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/feedback": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/tacots/feedback/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/onboarding": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/forms/tacots/onboarding/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/recommendation": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(TacotsRecommendationSortByOptions),
			status: getOptionalEnumSchema(AdminReviewStatusOptions),
		}),
	},

	"@get/forms/tacots/recommendation/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/tracking": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema.extend({
			academicSession: getOptionalEnumSchema(AcademicSessionOptions),
			term: getOptionalEnumSchema(TacotsAcademicTermOptions),
		}),
	},

	"@get/forms/tacots/tracking/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/volunteer": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(VolunteerSortByOptions),
			status: getOptionalEnumSchema(ReviewStatusOptions),
		}),
	},

	"@get/volunteer/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@get/volunteer/all/feedback": {
		data: withBaseSuccessResponse(z.array(z.unknown())),
		query: PaginatedQuerySchema,
	},

	"@get/volunteer/feedback/:id": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@patch/forms/ash/registration/:id/assign-mentor": {
		body: z.object({
			mentor: z.string().min(3, "Enter at least 3 characters."),
		}),
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
	},

	"@patch/forms/ash/registration/:id/status": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
		query: ReviewStatusQuerySchema,
	},

	"@patch/forms/tacots/recommendation/:id/status": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
		query: AdminReviewStatusQuerySchema,
	},

	"@patch/volunteer/:id/status": {
		data: withBaseSuccessResponse(z.unknown()),
		params: IdParamsSchema,
		query: ReviewStatusQuerySchema,
	},

	"@post/forms/ash/attendance": {
		body: z.object({
			programReview: z.string().optional(),
			sessionDate: DateStringSchema,
			sessionDetails: z.string().optional(),
			sessionsConducted: getOptionalEnumArraySchema(AshSessionConductedOptions),
			studentsInAttendance: z.array(z.uuid("Invalid ID.")).min(1, "Select at least one student."),
			studentsMentored: z.array(z.uuid("Invalid ID.")).min(1, "Select at least one student."),
			volunteersInAttendance: RequiredStringSchema,
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/ash/exit": {
		body: z.object({
			academicImpactRating: getRatingSchema(10),
			ageAtExit: stringWithNumberValidation(z.int().min(6).max(18)),
			areasOfImprovement: getOptionalEnumArraySchema(AshAreasOfImprovementOptions),
			classAtExit: getRequiredEnumSchema(ClassOptions),
			courseOfStudy: z.string().optional(),
			durationInProgram: getRequiredEnumSchema(AshExitDurationOptions),
			enjoyedMost: z.string().optional(),
			exitDate: DateStringSchema,
			exitReason: getRequiredEnumSchema(AshExitReasonOptions),
			facilitatorName: RequiredStringSchema,
			improvementSuggestions: z.string().optional(),
			institutionName: z.string().optional(),
			mentorshipImpactRating: getRatingSchema(10).optional(),
			mentorshipReceived: getRequiredEnumSchema(AshMentorshipReceivedOptions),
			postAshStatus: getRequiredEnumSchema(AshPostExitStatusOptions),
			programImpact: z.string().optional(),
			schoolName: RequiredStringSchema,
			studentId: z.uuid("Invalid ID."),
			vocationalSkill: z.string().optional(),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/ash/tracking": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/capacity-building": {
		body: z.object({
			budgetAllocated: z.string().optional(),
			budgetUtilized: z.string().optional(),
			challengesAddressed: z.string().optional(),
			challengesEncountered: z.string().optional(),
			communicationAndCoordination: getRatingSchema(),
			dateSubmitted: DateStringSchema,
			effectiveActivities: z.string().optional(),
			improvementSuggestions: z.string().optional(),
			inadequateResourcesExplanation: z.string().optional(),
			lessonsLearned: z.string().optional(),
			listOfSponsors: RequiredStringSchema,
			location: RequiredStringSchema,
			majorActivities: z.string().optional(),
			name: RequiredStringSchema,
			numberOfFacilitators: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfParticipants: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfSponsors: stringWithNumberValidation(z.int("Enter a whole number.")),
			numberOfVolunteers: stringWithNumberValidation(z.int("Enter a whole number.")),
			objectiveAchievement: getRequiredEnumSchema(CapacityObjectiveAchievementOptions),
			overallSuccess: getOptionalEnumSchema(CapacityOverallSuccessOptions),
			participantEngagementLevel: getRequiredEnumSchema(CapacityEngagementLevelOptions),
			partnerOrganizations: z.string().optional(),
			partnershipLevel: getRequiredEnumSchema(CapacityPartnershipLevelOptions),
			programCoordinator: RequiredStringSchema,
			programDate: DateStringSchema,
			programImpact: z.string().optional(),
			programName: RequiredStringSchema,
			programObjectives: z.string().optional(),
			programOutcome: z.string().optional(),
			programType: getRequiredEnumSchema(CapacityProgramTypeOptions),
			recommendFuturePrograms: z.string().optional(),
			recommendTheProgram: getOptionalEnumSchema(CapacityYesNoOptions),
			resourceAvailability: getRatingSchema(),
			role: RequiredStringSchema,
			sponsorshipType: getRequiredEnumSchema(CapacitySponsorshipTypeOptions),
			targetAudience: RequiredStringSchema,
			teamworkAmongOrganizers: getRatingSchema(),
			timeManagement: getRatingSchema(),
			venueSuitability: getRatingSchema(),
			wereResourcesAdequate: getOptionalEnumSchema(CapacityYesNoOptions),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/outreaches": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/tacots/exit": {
		body: z.object({
			additionalSituationInfo: z.string().optional(),
			completedBy: RequiredStringSchema,
			completedSecondaryElsewhere: getOptionalEnumSchema(TacotsExitCompletedSecondaryElsewhereOptions),
			currentStatus: getRequiredEnumSchema(TacotsExitCurrentStatusOptions),
			employmentType: z.string().optional(),
			exitReason: getRequiredEnumSchema(TacotsExitReasonOptions),
			higherInstitutionCity: z.string().optional(),
			higherInstitutionName: z.string().optional(),
			higherInstitutionState: z.string().optional(),
			highestEducationAttained: getRequiredEnumSchema(TacotsHighestEducationAttainedOptions),
			newSchoolName: z.string().optional(),
			programImpactDescription: z.string().optional(),
			programImpactRating: getRatingSchema(10).optional(),
			schoolAttendedDuringProgram: RequiredStringSchema,
			studentId: z.uuid("Invalid ID."),
			submissionDate: DateStringSchema,
			vocationalSkill: getOptionalEnumSchema(TacotsVocationalSkillOptions),
			yearOfExit: stringWithNumberValidation(z.int("Enter a valid year.")),
		}),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/tacots/onboarding": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse(z.unknown()),
	},

	"@post/forms/tacots/tracking": {
		body: z.instanceof(FormData),
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
		...dashboardRoutes,
		...generalRoutes,
		...lookupRoutes,
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
