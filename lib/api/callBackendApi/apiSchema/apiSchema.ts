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
	DonateSupportAreaOptions,
	AshAreasOfImprovementOptions,
	AshAttendanceFrequencyOptions,
	AshChildBenefitedOptions,
	AshEnjoyedPartsOptions,
	AshExitDurationOptions,
	AshExitReasonOptions,
	AshExitSortByOptions,
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
	AshTrackingRecordSortByOptions,
	AshTrackingSortByOptions,
	CapacityEngagementLevelOptions,
	CapacityEvaluationSortByOptions,
	CapacityObjectiveAchievementOptions,
	CapacityOverallSuccessOptions,
	CapacityPartnershipLevelOptions,
	CapacityProgramTypeOptions,
	CapacitySponsorshipTypeOptions,
	CapacityYesNoOptions,
	ClassOptions,
	GalleryFolderOptions,
	GenderOptions,
	LearningConditionStatusOptions,
	NigeriaStateOptions,
	OrderByOptions,
	OutreachSortByOptions,
	OutreachTypeOptions,
	ParentGuardianRelationshipOptions,
	PartnerInterestOptions,
	PositiveChangeNoticedOptions,
	PrimaryLanguageOptions,
	ProgramLinkProgramOptions,
	ProgramLinkTypeOptions,
	ProjectStatusOptions,
	ReceiptSortByOptions,
	ReviewStatusOptions,
	TacotsAcademicTermOptions,
	TacotsAllergyOptions,
	TacotsAnnualHouseholdIncomeOptions,
	TacotsAssessmentPeriodOptions,
	TacotsBehavioralIndicatorOptions,
	TacotsCatholicSacramentOptions,
	TacotsChronicConditionOptions,
	TacotsCurrentChallengeOptions,
	TacotsDiagnosedConditionOptions,
	TacotsExitCompletedSecondaryElsewhereOptions,
	TacotsExitCurrentStatusOptions,
	TacotsExitReasonOptions,
	TacotsExitSortByOptions,
	TacotsFamilyPositionOptions,
	TacotsFeedbackClassOptions,
	TacotsGeneralHealthStatusOptions,
	TacotsGuardianRelationshipOptions,
	TacotsHighestEducationAttainedOptions,
	TacotsImmunizationStatusOptions,
	TacotsIncomeEarnerCountOptions,
	TacotsIncomeSourceOptions,
	TacotsLivesWithOptions,
	TacotsMentalHealthDiagnosisOptions,
	TacotsMentorshipDurationOptions,
	TacotsMentorshipModeOptions,
	TacotsMostHelpfulSupportOptions,
	TacotsNeedsSpecialSupportOptions,
	TacotsOnboardingSortByOptions,
	TacotsPhysicalLimitationOptions,
	TacotsRecommendationReligionOptions,
	TacotsRecommendationSortByOptions,
	TacotsResidenceTypeOptions,
	TacotsScholarshipHelpedStayOptions,
	TacotsScholarshipReducedBurdenOptions,
	TacotsServiceActivityTypeOptions,
	TacotsServiceDurationOptions,
	TacotsSpecialCircumstanceOptions,
	TacotsSupportTypeOptions,
	TacotsTrackingRecordSortByOptions,
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
	data: z.null().optional(),
	message: z.string(),
	meta: z.record(z.string(), z.unknown()).optional(),
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

const withBaseSuccessResponse = <TDataSchema extends z.ZodType>(schemas: { data: TDataSchema }) => {
	return BaseSuccessResponseSchema.extend({
		data: schemas.data,
	});
};

const withBaseSuccessResponseAndMeta = <
	TDataSchema extends z.ZodType,
	TMetaSchema extends z.ZodType,
>(schemas: {
	data: TDataSchema;
	meta: TMetaSchema;
}) => {
	return BaseSuccessResponseSchema.extend({
		data: schemas.data,
		meta: schemas.meta,
	});
};

const withBaseErrorResponse = <TErrorSchema extends z.ZodType>(errorSchema?: TErrorSchema) => {
	if (errorSchema) {
		return BaseErrorResponseSchema.extend({
			error: errorSchema,
		});
	}

	return BaseErrorResponseSchema.extend({
		error: BaseErrorResponseSchema.shape.error,
	});
};

const stringWithNumberValidation = <TNumberSchema extends z.ZodNumber>(numberSchema: TNumberSchema) => {
	return z.preprocess((value: string) => Number(value), numberSchema);
};

const RequiredStringSchema = z.string().min(1, "This field is required.");

const DateStringSchema = z.iso.date("Enter a valid date.");

const RequiredPhoneNumberSchema = z.union([
	z.e164("Enter a valid phone number."),
	z.string().regex(/^0\d{10}$/, "Enter a valid phone number."),
]);

const OptionalPhoneNumberSchema = RequiredPhoneNumberSchema.optional();

const RequiredFileSchema = z.file("Upload a file.");

const getRatingSchema = (maxRating: 10 | 5 = 5) => {
	const message = `Select a rating from 1 to ${maxRating}.`;

	return stringWithNumberValidation(z.int(message).min(1, message).max(maxRating, message));
};

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
		orderBy: getOptionalEnumSchema(OrderByOptions),
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
	url: z.url(),
});

const BlogSchema = z.object({
	date: z.string(),
	description: z.string().nullable().optional(),
	documentUrl: z.url(),
	id: z.uuid(),
	publicId: z.string(),
	title: z.string(),
});

const AuthUserSchema = z.object({
	createdAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	department: z.string(),
	email: z.email(),
	id: z.uuid(),
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

const RoleSchema = z.object({
	createdAt: z.string(),
	deletedAt: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	id: z.uuid(),
	isDefault: z.boolean(),
	name: z.string(),
	updatedAt: z.string().nullable().optional(),
});

const UserRoleSchema = z.object({
	createdAt: z.string().optional(),
	deletedAt: z.string().nullable().optional(),
	id: z.uuid(),
	roleId: z.uuid().optional(),
	updatedAt: z.string().nullable().optional(),
	userId: z.uuid().optional(),
});

const ProjectSchema = z.object({
	createdAt: z.string().optional(),
	description: z.string().nullable().optional(),
	id: z.uuid(),
	imagePublicId: z.string().nullable().optional(),
	imageUrl: z.url().nullable().optional(),
	status: z.enum(ProjectStatusOptions),
	title: z.string(),
	updatedAt: z.string().nullable().optional(),
});

const ReceiptSchema = z.object({
	amount: z.number(),
	createdAt: z.string(),
	deletedAt: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	id: z.uuid(),
	imagePublicId: z.string(),
	imageUrl: z.url(),
	name: z.string(),
	updatedAt: z.string().nullable().optional(),
	uploadedBy: z.string(),
});

const GoogleFormSchema = z.object({
	createdAt: z.string().optional(),
	deadline: z.string().optional(),
	description: z.string().nullable().optional(),
	id: z.uuid().optional(),
	src: z.string(),
	title: z.string(),
});

const TimestampSchema = z.object({
	createdAt: z.string().nullable().optional(),
	deletedAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});

const FormRecordSchema = TimestampSchema.extend({
	id: z.uuid(),
});

const AshAttendanceTrackerRecordSchema = FormRecordSchema.extend({
	programReview: z.string().nullable().optional(),
	sessionDate: z.string(),
	sessionDetails: z.string().nullable().optional(),
	sessionsConducted: z.array(z.string()).nullable().optional(),
	studentsInAttendance: z.array(z.string()),
	studentsMentored: z.array(z.string()),
	volunteersInAttendance: z.string(),
});

const AshTermlyTrackingRecordSchema = FormRecordSchema.extend({
	academicSession: z.string(),
	challengesObserved: z.string().nullable().optional(),
	disciplineRating: z.number(),
	firstName: z.string(),
	leadershipRating: z.number(),
	mentorName: z.string(),
	midtestAverage: z.number().nullable().optional(),
	midtestLiteracyScore: z.number().nullable().optional(),
	midtestNumeracyScore: z.number().nullable().optional(),
	nextTermRecommendations: z.string().nullable().optional(),
	notableAchievements: z.string().nullable().optional(),
	posttestAverage: z.number().nullable().optional(),
	posttestLiteracyScore: z.number().nullable().optional(),
	posttestNumeracyScore: z.number().nullable().optional(),
	pretestAverage: z.number().nullable().optional(),
	pretestLiteracyScore: z.number().nullable().optional(),
	pretestNumeracyScore: z.number().nullable().optional(),
	responsibilityRating: z.number(),
	schoolAverage: z.number().nullable().optional(),
	schoolLiteracyScore: z.number().nullable().optional(),
	schoolName: z.string(),
	schoolNumeracyScore: z.number().nullable().optional(),
	schoolPosition: z.string().nullable().optional(),
	studentId: z.uuid(),
	surname: z.string(),
	term: z.string(),
	termResultPublicId: z.string(),
	termResultUrl: z.string(),
});

const AshExitTrackerRecordSchema = FormRecordSchema.extend({
	academicImpactRating: z.number(),
	ageAtExit: z.number(),
	areasOfImprovement: z.array(z.string()).nullable().optional(),
	classAtExit: z.string(),
	courseOfStudy: z.string().nullable().optional(),
	durationInProgram: z.string(),
	enjoyedMost: z.string().nullable().optional(),
	exitDate: z.string(),
	exitReason: z.string(),
	facilitatorName: z.string(),
	firstName: z.string(),
	improvementSuggestions: z.string().nullable().optional(),
	institutionName: z.string().nullable().optional(),
	mentorshipImpactRating: z.number().nullable().optional(),
	mentorshipReceived: z.string(),
	postAshStatus: z.string(),
	programImpact: z.string().nullable().optional(),
	schoolName: z.string(),
	studentId: z.uuid(),
	surname: z.string(),
	vocationalSkill: z.string().nullable().optional(),
});

const OutreachTrackerRecordSchema = FormRecordSchema.extend({
	activityDescription: z.string(),
	challengesEncountered: z.string().nullable().optional(),
	impactStories: z.string().nullable().optional(),
	numBeneficiaries: z.number(),
	numVolunteers: z.number(),
	outreachCity: z.string(),
	outreachCommunity: z.string(),
	outreachEndDate: z.string(),
	outreachLga: z.string(),
	outreachStartDate: z.string(),
	outreachState: z.string(),
	outreachType: z.array(z.string()),
	recommendations: z.string().nullable().optional(),
	submissionDate: z.string(),
	submittedBy: z.string(),
});

const CapacityEvaluationRecordSchema = FormRecordSchema.extend({
	budgetAllocated: z.string().nullable().optional(),
	budgetUtilized: z.string().nullable().optional(),
	challengesAddressed: z.string().nullable().optional(),
	challengesEncountered: z.string().nullable().optional(),
	communicationAndCoordination: z.number(),
	dateSubmitted: z.string(),
	effectiveActivities: z.string().nullable().optional(),
	improvementSuggestions: z.string().nullable().optional(),
	inadequateResourcesExplanation: z.string().nullable().optional(),
	lessonsLearned: z.string().nullable().optional(),
	listOfSponsors: z.string(),
	location: z.string(),
	majorActivities: z.string().nullable().optional(),
	name: z.string(),
	numberOfFacilitators: z.number(),
	numberOfParticipants: z.number(),
	numberOfSponsors: z.number(),
	numberOfVolunteers: z.number(),
	objectiveAchievement: z.string(),
	overallSuccess: z.string().nullable().optional(),
	participantEngagementLevel: z.string(),
	partnerOrganizations: z.string().nullable().optional(),
	partnershipLevel: z.string(),
	programCoordinator: z.string(),
	programDate: z.string(),
	programImpact: z.string().nullable().optional(),
	programName: z.string(),
	programObjectives: z.string().nullable().optional(),
	programOutcome: z.string().nullable().optional(),
	programType: z.string(),
	recommendFuturePrograms: z.string().nullable().optional(),
	recommendTheProgram: z.string().nullable().optional(),
	resourceAvailability: z.number(),
	role: z.string(),
	sponsorshipType: z.string(),
	targetAudience: z.string(),
	teamworkAmongOrganizers: z.number(),
	timeManagement: z.number(),
	venueSuitability: z.number(),
	wereResourcesAdequate: z.string().nullable().optional(),
});

const TacotsOnboardingTrackerRecordSchema = FormRecordSchema.extend({
	additionalHealthNotes: z.string().nullable().optional(),
	additionalInfo: z.string().nullable().optional(),
	admissionLetterPublicId: z.string().nullable().optional(),
	admissionLetterUrl: z.string().nullable().optional(),
	allergies: z.array(z.string()).nullable().optional(),
	behavioralIndicators: z.array(z.string()),
	chronicConditions: z.array(z.string()).nullable().optional(),
	diagnosedConditions: z.array(z.string()).nullable().optional(),
	emotionalStabilityRating: z.number(),
	enrolledClass: z.string(),
	enrolledSchoolLga: z.string(),
	enrolledSchoolName: z.string(),
	enrolledSchoolState: z.string(),
	enrolledSchoolTown: z.string(),
	firstName: z.string(),
	focusAbilityRating: z.number(),
	generalHealthStatus: z.string(),
	hasChronicCondition: z.string(),
	hasMentalHealthDiagnosis: z.string(),
	immunizationStatus: z.string(),
	mentalHealthNotes: z.string().nullable().optional(),
	mentorName: z.string().nullable().optional(),
	needsSpecialSupport: z.string(),
	onboardingDate: z.string(),
	parentGuardianCommitment: z.boolean(),
	parentSignaturePublicId: z.string().nullable().optional(),
	parentSignatureUrl: z.string().nullable().optional(),
	peerInteractionRating: z.number(),
	physicalActivityLevel: z.number(),
	physicalLimitations: z.string(),
	programOfficerNotes: z.string().nullable().optional(),
	receivedCounseling: z.string(),
	requiresMedication: z.string(),
	schoolFeesPerTerm: z.number().nullable().optional(),
	sponsorName: z.string().nullable().optional(),
	studentCommitment: z.boolean().nullable().optional(),
	studentId: z.uuid(),
	supportTypesApproved: z.array(z.string()).nullable().optional(),
	surname: z.string(),
	termResumptionDate: z.string(),
});

const TacotsTrackingRecordSchema = z.object({
	academicComment: z.string().nullable().optional(),
	academicSession: z.string(),
	academicTerm: z.string(),
	assessmentPeriod: z.string(),
	financialNotes: z.string().nullable().optional(),
	firstName: z.string(),
	formationComments: z.string().nullable().optional(),
	highestSubjectScore: z.string(),
	id: z.uuid(),
	lowestSubjectScore: z.string(),
	mentorName: z.string(),
	mentorshipDuration: z.string(),
	mentorshipMode: z.string(),
	mentorshipNotes: z.string(),
	mentorshipSessionDate: z.string(),
	paymentEvidencePublicId: z.string().nullable().optional(),
	paymentEvidenceUrl: z.string().nullable().optional(),
	region: z.string(),
	resourcesSpent: z.number(),
	responsibilityRating: z.number(),
	schoolId: z.uuid().optional(),
	schoolName: z.string().optional(),
	schoolRulesRating: z.number(),
	serviceActivityType: z.string(),
	serviceDate: z.string(),
	serviceDescription: z.string(),
	serviceDuration: z.string(),
	serviceSupervisor: z.string(),
	socialBehaviorRating: z.number(),
	studentAveragePct: z.number(),
	studentId: z.uuid(),
	studentPositionInClass: z.string(),
	submissionDate: z.string(),
	sundriesSpent: z.number(),
	surname: z.string(),
	termResultPublicId: z.string(),
	termResultUrl: z.string(),
	totalAmountSpent: z.number(),
	tuitionFeePaid: z.number(),
});

const TacotsExitTrackerRecordSchema = FormRecordSchema.extend({
	additionalSituationInfo: z.string().nullable().optional(),
	completedBy: z.string(),
	completedSecondaryElsewhere: z.string().nullable().optional(),
	currentStatus: z.string(),
	employmentType: z.string().nullable().optional(),
	exitReason: z.string(),
	firstName: z.string(),
	higherInstitutionCity: z.string().nullable().optional(),
	higherInstitutionName: z.string().nullable().optional(),
	higherInstitutionState: z.string().nullable().optional(),
	highestEducationAttained: z.string(),
	newSchoolName: z.string().nullable().optional(),
	programImpactDescription: z.string().nullable().optional(),
	programImpactRating: z.number().nullable().optional(),
	schoolAttendedDuringProgram: z.string(),
	studentId: z.uuid(),
	submissionDate: z.string(),
	surname: z.string(),
	vocationalSkill: z.string().nullable().optional(),
	yearOfExit: z.number(),
});

const AshRegistrationRecordSchema = FormRecordSchema.extend({
	age: z.number(),
	assignedMentor: z.string().nullable().optional(),
	classPositionLastTerm: z.string(),
	currentClass: z.string(),
	declarationConfirmed: z.boolean(),
	dob: z.string(),
	fathersName: z.string(),
	fathersOccupation: z.string(),
	fathersPhone: z.string().nullable().optional(),
	firstName: z.string(),
	gender: z.string(),
	guardianName: z.string().nullable().optional(),
	guardianOccupation: z.string().nullable().optional(),
	guardianPhone: z.string().nullable().optional(),
	guardianRelationship: z.string().nullable().optional(),
	hasLearningCondition: z.string(),
	homeAddress: z.string(),
	householdIncomeRange: z.string().nullable().optional(),
	lastResultPublicId: z.string().nullable().optional(),
	lastResultUrl: z.string().nullable().optional(),
	learningConditions: z.array(z.string()).nullable().optional(),
	middleName: z.string().nullable().optional(),
	mothersName: z.string(),
	mothersOccupation: z.string().nullable().optional(),
	mothersPhone: z.string(),
	parentConsent: z.boolean(),
	parentSignaturePublicId: z.string(),
	parentSignatureUrl: z.string(),
	passportPhotoPublicId: z.string(),
	passportPhotoUrl: z.string(),
	pretestScore: z.number().nullable().optional(),
	prevAfterschoolProgram: z.string(),
	primaryLanguage: z.string(),
	programType: z.string(),
	reasonForJoining: z.string(),
	schoolLga: z.string(),
	schoolName: z.string(),
	schoolState: z.string(),
	schoolTown: z.string(),
	status: z.enum(ReviewStatusOptions),
	studentPhone: z.string().nullable().optional(),
	surname: z.string(),
});

const AshFeedbackRecordSchema = FormRecordSchema.extend({
	academicImprovementNoticed: z.string().nullable().optional(),
	additionalComments: z.string().nullable().optional(),
	attendanceFrequency: z.string(),
	childBenefited: z.string(),
	confidenceBehaviorChange: z.string().nullable().optional(),
	confidenceRating: z.number(),
	currentClass: z.string(),
	enjoyedParts: z.array(z.string()).nullable().optional(),
	learningImprovementRating: z.number(),
	mostValuableAspects: z.array(z.string()).nullable().optional(),
	parentGuardianName: z.string(),
	parentGuardianRelationship: z.string(),
	parentImprovementSuggestions: z.string().nullable().optional(),
	parentPhone: z.string().nullable().optional(),
	parentSatisfactionRating: z.number().nullable().optional(),
	programImpactOnChild: z.string().nullable().optional(),
	schoolName: z.string(),
	studentEnjoyedMost: z.string().nullable().optional(),
	studentFirstName: z.string(),
	studentImprovementSuggestions: z.string().nullable().optional(),
	studentSurname: z.string(),
	volunteerSupportRating: z.number(),
});

const StatusRecordSchema = z.object({
	id: z.uuid(),
	status: z.string(),
});

const VolunteerStatusRecordSchema = StatusRecordSchema.extend({
	email: z.email(),
	name: z.string(),
	volunteerAreas: z.array(z.string()),
});

const PaginationMetaSchema = z.object({
	limit: z.number(),
	page: z.number(),
	totalPages: z.number(),
});

const PaginatedMetaSchema = z.object({
	pagination: PaginationMetaSchema,
});

const ProjectListMetaSchema = z.object({
	ongoingProjectCount: z.number(),
});

const FormDataReviewMetadataSchema = z.object({
	acceptedStudents: z.number(),
	pendingStudents: z.number(),
	rejectedStudents: z.number(),
	totalSubmissions: z.number(),
});

const FormDataReviewPaginatedMetaSchema = PaginatedMetaSchema.extend({
	metadata: FormDataReviewMetadataSchema.optional(),
});

const AshTrackerDataMetadataSchema = z.object({
	avgAttendanceRate: z.number(),
	completed: z.number(),
	highRiskStudents: z.number(),
	totalRecords: z.number(),
});

const AshTrackerDataPaginatedMetaSchema = PaginatedMetaSchema.extend({
	metadata: AshTrackerDataMetadataSchema.optional(),
});

const OutreachTrackerDataMetadataSchema = z.object({
	beneficiariesReached: z.number(),
	communitiesEngaged: z.number(),
	outreachEvents: z.number(),
	volunteers: z.number(),
});

const OutreachTrackerDataPaginatedMetaSchema = PaginatedMetaSchema.extend({
	metadata: OutreachTrackerDataMetadataSchema.optional(),
});

const CapacityTrackerDataMetadataSchema = z.object({
	organizationsPartneredWith: z.number(),
	participantsImpacted: z.number(),
	volunteersEngaged: z.number(),
	workshopsConducted: z.number(),
});

const CapacityTrackerDataPaginatedMetaSchema = PaginatedMetaSchema.extend({
	metadata: CapacityTrackerDataMetadataSchema.optional(),
});

const TacotsTrackerDataMetadataSchema = z.object({
	completed: z.number(),
	highRiskStudents: z.number(),
	onboardingRate: z.number(),
	totalRecords: z.number(),
});

const TacotsTrackerDataPaginatedMetaSchema = PaginatedMetaSchema.extend({
	metadata: TacotsTrackerDataMetadataSchema.optional(),
});

const defaultSchemaRoute = defineSchemaRoutes({
	[fallBackRouteSchemaKey]: {
		errorData: withBaseErrorResponse(),
	},
});

const authRoutes = defineSchemaRoutes({
	"@get/auth/session": {
		data: withBaseSuccessResponse({ data: SessionUserSchema }),
	},

	"@post/auth/login": {
		body: LoginSchema,
		data: withBaseSuccessResponse({ data: AuthUserSchema }),
	},

	"@post/auth/logout": {
		data: withBaseSuccessResponse({ data: z.null() }),
	},
});

const adminRoutes = defineSchemaRoutes({
	"@delete/admin/users/:userId": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: UserIdParamsSchema,
	},

	"@get/admin/listusers": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(
				z.object({
					department: z.enum(AdminDepartmentOptions),
					email: z.email(),
					id: z.uuid(),
					name: z.string(),
				})
			),
			meta: PaginatedMetaSchema.optional(),
		}),
		query: PaginatedQuerySchema.optional(),
	},

	"@get/admin/roles": {
		data: withBaseSuccessResponse({ data: z.array(RoleSchema) }),
	},

	"@get/admin/roles/:userId": {
		data: withBaseSuccessResponse({
			data: z.array(
				z.object({
					description: z.string().nullable(),
					id: z.uuid(),
					isDefault: z.boolean(),
					name: z.enum(["volunteer", "admin", "superadmin"]),
				})
			),
		}),
		params: UserIdParamsSchema,
	},

	"@get/admin/users": {
		data: withBaseSuccessResponse({
			data: z.array(
				z.object({
					department: z.enum(AdminDepartmentOptions),
					email: z.email(),
					id: z.uuid(),
					name: z.string(),
				})
			),
		}),
	},

	"@patch/admin/roles/:userId/action": {
		data: withBaseSuccessResponse({ data: z.array(UserRoleSchema).nullable() }),
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
		data: withBaseSuccessResponse({ data: AuthUserSchema }),
	},
});

const blogRoutes = defineSchemaRoutes({
	"@delete/blogs/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@get/blogs": {
		data: withBaseSuccessResponse({ data: z.array(BlogSchema) }),
		query: PaginatedQuerySchema.pick({ limit: true, page: true, search: true }).optional(),
	},

	"@get/blogs/:id": {
		data: withBaseSuccessResponse({ data: BlogSchema }),
		params: IdParamsSchema,
	},

	"@patch/blogs/:id": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@post/blogs": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: BlogSchema }),
	},
});

const clientSideRoutes = defineSchemaRoutes({
	"@get/carousels/ash": {
		data: withBaseSuccessResponse({ data: z.array(GalleryPhotoSchema) }),
		query: PaginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/capacity-building": {
		data: withBaseSuccessResponse({ data: z.array(GalleryPhotoSchema) }),
		query: PaginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/outreaches": {
		data: withBaseSuccessResponse({ data: z.array(GalleryPhotoSchema) }),
		query: PaginatedQuerySchema.pick({ limit: true }).optional(),
	},

	"@get/carousels/tacots": {
		data: withBaseSuccessResponse({ data: z.array(GalleryPhotoSchema) }),
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
			supportAreas: getOptionalEnumArraySchema(DonateSupportAreaOptions),
		}),
		data: withBaseSuccessResponse({
			data: z.object({
				data: z.object({
					access_code: z.string(),
					authorization_url: z.url(),
					reference: z.string(),
				}),
				message: z.string(),
				status: z.boolean(),
			}),
		}),
	},

	"@post/feedback/home": {
		body: z.object({
			email: z.email("Enter a valid email address."),
			feedback: z
				.string()
				.min(10, "Enter at least 10 characters.")
				.max(500, "Keep this under 500 characters."),
		}),
		data: withBaseSuccessResponse({ data: z.null() }),
	},

	"@post/send-links/initiatives": {
		body: z.object({
			email: z.email("Enter a valid email address."),
			name: z.string().min(3, "Enter at least 3 characters.").max(256),
		}),
		data: withBaseSuccessResponse({ data: z.null() }),
		query: z.object({
			program: getRequiredEnumSchema(ProgramLinkProgramOptions),
			type: getRequiredEnumSchema(ProgramLinkTypeOptions),
		}),
	},

	"@post/send-links/partners": {
		body: z.object({
			email: z.email("Enter a valid email address."),
			name: z.string().min(3, "Enter at least 3 characters.").max(256),
			option: getRequiredEnumArraySchema(PartnerInterestOptions),
		}),
		data: withBaseSuccessResponse({ data: z.null() }),
	},
});

const DashboardChartDatasetSchema = z.object({
	datasets: z.array(
		z.object({
			data: z.array(z.number().nullable()),
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
	home: z.object({
		communitiesImpacted: z.number(),
		totalBeneficiaries: z.number(),
		volunteersEngaged: z.number(),
		yearsOfImpact: z.number(),
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
	c_tacots_scores: DashboardChartDatasetSchema,
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
		data: withBaseSuccessResponse({ data: DashboardCardsSchema }),
	},

	"@get/dashboard/enrollment": {
		data: withBaseSuccessResponse({ data: EnrollmentMetricsSchema }),
	},

	"@get/dashboard/institutional-effectiveness": {
		data: withBaseSuccessResponse({ data: InstitutionalEffectivenessMetricsSchema }),
	},

	"@get/dashboard/notifications": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(
				z.object({
					createdAt: z.string(),
					dedupeKey: z.string(),
					deletedAt: z.string().nullable(),
					dismissedAt: z.string().nullable(),
					entityType: z.enum(["ash", "volunteer", "tacots", "capacity_building", "administrative"]),
					id: z.uuid(),
					message: z.string(),
					metadata: z.string().nullable(),
					resolvedAt: z.string().nullable(),
					severity: z.enum(["low", "medium", "high", "critical"]),
					status: z.enum(["active", "dismissed", "resolved"]),
					title: z.string(),
					type: z.enum([
						"POTENTIAL_DROPOUT_RISK",
						"LOW_ATTENDANCE_RATE",
						"LOW_MENTORSHIP_ENGAGEMENT",
						"SCORE_DROP_ALERT",
						"VOLUNTEER_INACTIVITY",
					]),
					updatedAt: z.string().nullable(),
				})
			),
			meta: PaginatedMetaSchema,
		}),
		query: z
			.object({
				entityType: z
					.enum(["ash", "volunteer", "tacots", "capacity_building", "administrative"])
					.optional(),
				limit: z.number().min(1).max(100).optional(),
				page: z.number().min(1).optional(),
				status: z.enum(["active", "dismissed", "resolved"]).optional(),
				type: z
					.enum([
						"POTENTIAL_DROPOUT_RISK",
						"LOW_ATTENDANCE_RATE",
						"LOW_MENTORSHIP_ENGAGEMENT",
						"SCORE_DROP_ALERT",
						"VOLUNTEER_INACTIVITY",
					])
					.optional(),
			})
			.optional(),
	},

	"@get/dashboard/student-performance": {
		data: withBaseSuccessResponse({ data: StudentPerformanceMetricsSchema }),
	},

	"@patch/dashboard/notifications/:id": {
		data: BaseSuccessResponseSchema,
		params: IdParamsSchema,
	},
});

const generalRoutes = defineSchemaRoutes({
	"@delete/general/projects/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/general/receipts/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@get/general/download/receipts": {},

	"@get/general/google-forms": {
		data: withBaseSuccessResponse({ data: GoogleFormSchema }),
	},

	"@get/general/metadata": {
		data: withBaseSuccessResponse({
			data: z.object({
				activeProjects: z.number(),
				photosUploaded: z.number(),
				receiptsLogged: z.number(),
				systemUsers: z.number(),
			}),
		}),
	},

	"@get/general/projects": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(ProjectSchema),
			meta: ProjectListMetaSchema,
		}),
	},

	"@get/general/receipts": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(ReceiptSchema),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(ReceiptSortByOptions),
		}).optional(),
	},

	"@patch/general/projects/:id": {
		data: withBaseSuccessResponse({ data: ProjectSchema }),
		params: IdParamsSchema,
		query: z.object({
			status: getRequiredEnumSchema(ProjectStatusOptions),
		}),
	},

	"@post/general/gallery": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: z.null() }),
		query: z
			.object({
				folder: getOptionalEnumSchema(GalleryFolderOptions),
			})
			.optional(),
	},

	"@post/general/google-forms": {
		body: z.object({
			deadline: DateStringSchema,
			description: z.string().optional(),
			title: z.string().min(3).max(100),
			url: z.string(),
		}),
		data: withBaseSuccessResponse({ data: GoogleFormSchema }),
	},

	"@post/general/projects": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: ProjectSchema }),
	},

	"@post/general/receipts": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: ReceiptSchema }),
	},
});

const lookupRoutes = defineSchemaRoutes({
	"@get/lookup/ash-students": {
		data: withBaseSuccessResponse({
			data: z.array(
				z.object({
					id: z.uuid(),
					name: z.string(),
					status: z.literal("accepted"),
				})
			),
		}),
	},

	"@get/lookup/tacots-onboarded": {
		data: withBaseSuccessResponse({
			data: z.array(
				z.object({
					id: z.uuid(),
					name: z.string(),
					schoolName: z.string(),
				})
			),
		}),
	},

	"@get/lookup/tacots-recommended": {
		data: withBaseSuccessResponse({
			data: z.array(
				z.object({
					id: z.uuid(),
					name: z.string(),
					status: z.literal("SELECTED"),
				})
			),
		}),
	},

	"@get/lookup/volunteers": {
		data: withBaseSuccessResponse({
			data: z.array(
				z.object({
					id: z.uuid(),
					name: z.string(),
					status: z.literal("accepted"),
				})
			),
		}),
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
	file: RequiredFileSchema,
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

export const GeneralGalleryFrontendSchema = z.object({
	folder: z.enum(GalleryFolderOptions),
	photos: z.array(z.file()).min(1).max(3),
});

export const GeneralProjectFrontendSchema = z.object({
	description: z.string().optional(),
	file: z.file().optional(),
	title: z.string().min(3).max(150),
});

export const GeneralReceiptFrontendSchema = z.object({
	amount: stringWithNumberValidation(z.int().min(1000)),
	description: z.string().optional(),
	file: RequiredFileSchema,
	name: z.string().min(3).max(150),
});

export const BlogFrontendSchema = z.object({
	description: z.string().optional(),
	file: z.file().optional(),
	title: z.string().min(3, "Enter at least 3 characters."),
});

export const GoogleFormFrontendSchema = z.object({
	deadline: DateStringSchema,
	description: z.string().optional(),
	title: z.string().min(3).max(100),
	url: z.string(),
});

export const AdminCreateUserFrontendSchema = z.object({
	department: z.enum(AdminDepartmentOptions),
	email: z.email(),
	name: z.string().min(3),
	password: z.string().min(8),
});

export const AdminUserRoleFrontendSchema = z.object({
	roleName: z.enum(AdminRoleNameOptions),
	userId: z.uuid(),
});

export const AdminDeleteUserFrontendSchema = z.object({
	userId: z.uuid(),
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
	academicSession: getRequiredEnumSchema(AcademicSessionOptions),
	academicTerm: getRequiredEnumSchema(TacotsAcademicTermOptions),
	assessmentPeriod: getRequiredEnumSchema(TacotsAssessmentPeriodOptions),
	financialNotes: z.string().optional(),
	formationComments: z.string().optional(),
	highestSubjectScore: RequiredStringSchema,
	lowestSubjectScore: RequiredStringSchema,
	mentorName: RequiredStringSchema,
	mentorshipDuration: getRequiredEnumSchema(TacotsMentorshipDurationOptions),
	mentorshipMode: getRequiredEnumSchema(TacotsMentorshipModeOptions),
	mentorshipNotes: RequiredStringSchema,
	mentorshipSessionDate: DateStringSchema,
	paymentEvidence: z.file().optional(),
	region: getRequiredEnumSchema(NigeriaStateOptions),
	resourcesSpent: stringWithNumberValidation(z.number("Enter a valid amount.").min(0)),
	responsibilityRating: getRatingSchema(),
	schoolId: z.uuid("Invalid ID."),
	schoolRulesRating: getRatingSchema(),
	serviceActivityType: getRequiredEnumSchema(TacotsServiceActivityTypeOptions),
	serviceDate: DateStringSchema,
	serviceDescription: RequiredStringSchema,
	serviceDuration: getRequiredEnumSchema(TacotsServiceDurationOptions),
	serviceSupervisor: RequiredStringSchema,
	socialBehaviorRating: getRatingSchema(),
	studentAveragePct: stringWithNumberValidation(
		z
			.number("Enter a valid average.")
			.min(0, "Average cannot be below 0.")
			.max(100, "Average cannot exceed 100.")
	),
	studentId: z.uuid("Invalid ID."),
	studentPositionInClass: RequiredStringSchema,
	submissionDate: DateStringSchema,
	sundriesSpent: stringWithNumberValidation(z.number("Enter a valid amount.").min(0)),
	termResult: RequiredFileSchema,
	totalAmountSpent: stringWithNumberValidation(z.number("Enter a valid amount.").min(0)),
	tuitionFeePaid: stringWithNumberValidation(z.number("Enter a valid amount.").min(0)),
});

export const TacotsOnboardingFrontendSchema = z.object({
	additionalHealthNotes: z.string().optional(),
	additionalInfo: z.string().optional(),
	admissionLetter: z.file().optional(),
	allergies: getRequiredEnumArraySchema(TacotsAllergyOptions),
	behavioralIndicators: getRequiredEnumArraySchema(TacotsBehavioralIndicatorOptions),
	chronicConditions: getOptionalEnumArraySchema(TacotsChronicConditionOptions),
	diagnosedConditions: getOptionalEnumArraySchema(TacotsDiagnosedConditionOptions),
	emotionalStabilityRating: getRatingSchema(),
	enrolledClass: getRequiredEnumSchema(ClassOptions),
	enrolledSchoolLga: RequiredStringSchema,
	enrolledSchoolName: RequiredStringSchema,
	enrolledSchoolState: getRequiredEnumSchema(NigeriaStateOptions),
	enrolledSchoolTown: RequiredStringSchema,
	focusAbilityRating: getRatingSchema(),
	generalHealthStatus: getRequiredEnumSchema(TacotsGeneralHealthStatusOptions),
	hasChronicCondition: getRequiredEnumSchema(TacotsMentalHealthDiagnosisOptions),
	hasMentalHealthDiagnosis: getRequiredEnumSchema(TacotsMentalHealthDiagnosisOptions),
	immunizationStatus: getRequiredEnumSchema(TacotsImmunizationStatusOptions),
	mentalHealthNotes: z.string().optional(),
	mentorName: z.string().optional(),
	needsSpecialSupport: getRequiredEnumSchema(TacotsNeedsSpecialSupportOptions),
	onboardingDate: DateStringSchema,
	parentGuardianCommitment: z.boolean("This field is required."),
	parentSignature: z.file().optional(),
	peerInteractionRating: getRatingSchema(),
	physicalActivityLevel: getRatingSchema(),
	physicalLimitations: getRequiredEnumSchema(TacotsPhysicalLimitationOptions),
	programOfficerNotes: z.string().optional(),
	receivedCounseling: getRequiredEnumSchema(TacotsMentalHealthDiagnosisOptions),
	requiresMedication: getRequiredEnumSchema(YesNoOptions),
	schoolFeesPerTerm: z.preprocess(
		(value) => (value === "" || value === undefined ? undefined : Number(value)),
		z.number("Enter a valid amount.").min(0, "Amount cannot be below 0.").optional()
	),
	sponsorName: z.string().optional(),
	studentCommitment: z.boolean().optional(),
	studentId: z.uuid("Invalid ID."),
	supportTypesApproved: getOptionalEnumArraySchema(TacotsSupportTypeOptions),
	termResumptionDate: DateStringSchema,
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
		data: withBaseSuccessResponse({ data: AshFeedbackRecordSchema }),
	},

	"@post/forms/ash/registration": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: AshRegistrationRecordSchema }),
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
		data: withBaseSuccessResponse({
			data: FormRecordSchema.extend({
				academicImprovementNoticed: z.string().nullable().optional(),
				additionalComments: z.string().nullable().optional(),
				attitudeChangeNoticed: z.string().nullable().optional(),
				currentChallenges: z.array(z.string()).nullable().optional(),
				currentClass: z.string(),
				currentSchool: z.string(),
				likedMost: z.string().nullable().optional(),
				mentorshipImpactRating: z.number(),
				mostHelpfulSupport: z.array(z.string()).nullable().optional(),
				parentGuardianName: z.string(),
				parentGuardianRelationship: z.string(),
				parentImprovementSuggestions: z.string().nullable().optional(),
				parentPhone: z.string().nullable().optional(),
				parentSatisfactionRating: z.number().nullable().optional(),
				programImpactOnFamily: z.string().nullable().optional(),
				scholarshipHelpedStay: z.string(),
				scholarshipReducedBurden: z.string(),
				studentFirstName: z.string(),
				studentImprovementSuggestions: z.string().nullable().optional(),
				studentSurname: z.string(),
				studyMotivationRating: z.number(),
			}),
		}),
	},

	"@post/forms/tacots/recommendation": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
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
		data: withBaseSuccessResponse({
			data: FormRecordSchema.extend({
				activitiesInvolvedIn: z.array(z.string()).nullable().optional(),
				additionalComments: z.string().nullable().optional(),
				challengesExperienced: z.string().nullable().optional(),
				continueVolunteering: z.string().nullable().optional(),
				enjoyedMost: z.string().nullable().optional(),
				firstName: z.string(),
				improvementSuggestions: z.string().nullable().optional(),
				organizationRating: z.number(),
				overallExperienceRating: z.number(),
				programMadeImpact: z.string().nullable().optional(),
				programVolunteered: z.string(),
				roleClarityRating: z.number(),
				skillsDeveloped: z.string().nullable().optional(),
				skillsGained: z.array(z.string()).nullable().optional(),
				specificProgramDetails: z.string().nullable().optional(),
				submissionDate: z.string(),
				surname: z.string(),
				teamSupportRating: z.number(),
				volunteerDuration: z.string().nullable().optional(),
				waysProgramHelped: z.array(z.string()).nullable().optional(),
				wouldRecommend: z.string().nullable().optional(),
			}),
		}),
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
		data: withBaseSuccessResponse({
			data: FormRecordSchema.extend({
				additionalInfo: z.string().nullable().optional(),
				age: z.number(),
				ashAcademicArea: z.string().nullable().optional(),
				ashExtracurricular: z.array(z.string()).nullable().optional(),
				ashSaturdayAvailability: z.string().nullable().optional(),
				availability: z.array(z.string()),
				city: z.string(),
				commitmentDuration: z.string().nullable().optional(),
				dob: z.string(),
				emailAddress: z.string(),
				firstName: z.string(),
				gender: z.string(),
				highestEducation: z.string().nullable().optional(),
				homeAddress: z.string(),
				mediaConsent: z.boolean(),
				middleName: z.string().nullable().optional(),
				occupation: z.string().nullable().optional(),
				phoneNumber: z.string(),
				reasonForVolunteering: z.string(),
				safeguardingAgreement: z.string(),
				skillsToContribute: z.array(z.string()).nullable().optional(),
				state: z.string(),
				status: getRequiredEnumSchema(ReviewStatusOptions),
				surname: z.string(),
				volunteerAreas: z.array(z.string()),
			}),
		}),
	},
});

const protectedFormRoutes = defineSchemaRoutes({
	"@delete/forms/ash/attendance/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/ash/exit/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/ash/registration/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/ash/tracking/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/capacity-building/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/outreaches/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/exit/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/feedback/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/onboarding/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/recommendation/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/forms/tacots/tracking/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/volunteer/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@delete/volunteer/feedback/:id": {
		data: withBaseSuccessResponse({ data: z.null() }),
		params: IdParamsSchema,
	},

	"@get/forms/ash/attendance": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(AshAttendanceTrackerRecordSchema),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.omit({ orderBy: true }).optional(),
	},

	"@get/forms/ash/attendance/:id": {
		data: withBaseSuccessResponse({ data: AshAttendanceTrackerRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/ash/download/ashattendance": {},

	"@get/forms/ash/download/ashexit": {},

	"@get/forms/ash/download/ashfeedback": {},

	"@get/forms/ash/download/ashstudent": {},

	"@get/forms/ash/download/ashtracking": {},

	"@get/forms/ash/exit": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(AshExitTrackerRecordSchema),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(AshExitSortByOptions),
		}).optional(),
	},

	"@get/forms/ash/exit/:id": {
		data: withBaseSuccessResponse({ data: AshExitTrackerRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/ash/feedback": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(AshFeedbackRecordSchema),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.omit({ orderBy: true }).optional(),
	},

	"@get/forms/ash/feedback/:id": {
		data: withBaseSuccessResponse({ data: AshFeedbackRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/ash/registration": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(AshRegistrationRecordSchema),
			meta: FormDataReviewPaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(AshTrackingSortByOptions),
			status: getOptionalEnumSchema(ReviewStatusOptions),
		}).optional(),
	},

	"@get/forms/ash/registration/:id": {
		data: withBaseSuccessResponse({ data: AshRegistrationRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/ash/tracking": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(AshTermlyTrackingRecordSchema),
			meta: AshTrackerDataPaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(AshTrackingRecordSortByOptions),
		}).optional(),
	},

	"@get/forms/ash/tracking/:id": {
		data: withBaseSuccessResponse({ data: AshTermlyTrackingRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/capacity-building": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(CapacityEvaluationRecordSchema),
			meta: CapacityTrackerDataPaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(CapacityEvaluationSortByOptions),
		}).optional(),
	},

	"@get/forms/capacity-building/:id": {
		data: withBaseSuccessResponse({ data: CapacityEvaluationRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/capacity-building/download/capacityevaluation": {},

	"@get/forms/outreaches": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(OutreachTrackerRecordSchema),
			meta: OutreachTrackerDataPaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(OutreachSortByOptions),
		}).optional(),
	},

	"@get/forms/outreaches/:id": {
		data: withBaseSuccessResponse({ data: OutreachTrackerRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/outreaches/download/outreachtracker": {},

	"@get/forms/tacots/download/tacotsexit": {},

	"@get/forms/tacots/download/tacotsfeedback": {},

	"@get/forms/tacots/download/tacotsonboarding": {},

	"@get/forms/tacots/download/tacotsrecommendation": {},

	"@get/forms/tacots/download/tacotstracking": {},

	"@get/forms/tacots/exit": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(TacotsExitTrackerRecordSchema),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(TacotsExitSortByOptions),
		}).optional(),
	},

	"@get/forms/tacots/exit/:id": {
		data: withBaseSuccessResponse({ data: TacotsExitTrackerRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/feedback": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(
				FormRecordSchema.extend({
					academicImprovementNoticed: z.string().nullable().optional(),
					additionalComments: z.string().nullable().optional(),
					attitudeChangeNoticed: z.string().nullable().optional(),
					currentChallenges: z.array(z.string()).nullable().optional(),
					currentClass: z.string(),
					currentSchool: z.string(),
					likedMost: z.string().nullable().optional(),
					mentorshipImpactRating: z.number(),
					mostHelpfulSupport: z.array(z.string()).nullable().optional(),
					parentGuardianName: z.string(),
					parentGuardianRelationship: z.string(),
					parentImprovementSuggestions: z.string().nullable().optional(),
					parentPhone: z.string().nullable().optional(),
					parentSatisfactionRating: z.number().nullable().optional(),
					programImpactOnFamily: z.string().nullable().optional(),
					scholarshipHelpedStay: z.string(),
					scholarshipReducedBurden: z.string(),
					studentFirstName: z.string(),
					studentImprovementSuggestions: z.string().nullable().optional(),
					studentSurname: z.string(),
					studyMotivationRating: z.number(),
				})
			),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.omit({ orderBy: true }).optional(),
	},

	"@get/forms/tacots/feedback/:id": {
		data: withBaseSuccessResponse({
			data: FormRecordSchema.extend({
				academicImprovementNoticed: z.string().nullable().optional(),
				additionalComments: z.string().nullable().optional(),
				attitudeChangeNoticed: z.string().nullable().optional(),
				currentChallenges: z.array(z.string()).nullable().optional(),
				currentClass: z.string(),
				currentSchool: z.string(),
				likedMost: z.string().nullable().optional(),
				mentorshipImpactRating: z.number(),
				mostHelpfulSupport: z.array(z.string()).nullable().optional(),
				parentGuardianName: z.string(),
				parentGuardianRelationship: z.string(),
				parentImprovementSuggestions: z.string().nullable().optional(),
				parentPhone: z.string().nullable().optional(),
				parentSatisfactionRating: z.number().nullable().optional(),
				programImpactOnFamily: z.string().nullable().optional(),
				scholarshipHelpedStay: z.string(),
				scholarshipReducedBurden: z.string(),
				studentFirstName: z.string(),
				studentImprovementSuggestions: z.string().nullable().optional(),
				studentSurname: z.string(),
				studyMotivationRating: z.number(),
			}),
		}),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/onboarding": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(TacotsOnboardingTrackerRecordSchema),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(TacotsOnboardingSortByOptions),
		}).optional(),
	},

	"@get/forms/tacots/onboarding/:id": {
		data: withBaseSuccessResponse({ data: TacotsOnboardingTrackerRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/recommendation": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(
				FormRecordSchema.extend({
					adminStatus: z.enum(AdminReviewStatusOptions),
					age: z.number(),
					annualHouseholdIncome: z.string(),
					avgMonthlyIncome: z.number().nullable().optional(),
					careerGoal: z.string(),
					catholicSacraments: z.array(z.string()).nullable().optional(),
					childBackgroundNotes: z.string(),
					classPositionLastTerm: z.string(),
					declarationConfirmed: z.boolean(),
					diocese: z.string().nullable().optional(),
					disciplineRating: z.number(),
					dob: z.string(),
					familyPosition: z.string(),
					fathersName: z.string(),
					fathersOccupation: z.string(),
					fathersPhone: z.string(),
					firstName: z.string(),
					gender: z.string(),
					guardianAddress: z.string().nullable().optional(),
					guardianName: z.string().nullable().optional(),
					guardianOccupation: z.string().nullable().optional(),
					guardianPhone: z.string().nullable().optional(),
					guardianRelationship: z.string().nullable().optional(),
					hasElectricity: z.string(),
					homeAddress: z.string(),
					householdSize: z.number(),
					incomeSources: z.array(z.string()),
					lastClass: z.string(),
					lastResultPublicId: z.string(),
					lastResultUrl: z.string(),
					lastTermAverage: z.number().nullable().optional(),
					lastYearAttended: z.number(),
					lga: z.string(),
					livesWith: z.string(),
					middleName: z.string().nullable().optional(),
					mothersName: z.string(),
					mothersOccupation: z.string(),
					mothersPhone: z.string(),
					nationality: z.string(),
					numIncomeEarners: z.string(),
					numSiblings: z.number(),
					otherImportantInfo: z.string().nullable().optional(),
					parentsAddress: z.string(),
					parishAttended: z.string().nullable().optional(),
					passportPhotoPublicId: z.string(),
					passportPhotoUrl: z.string(),
					phoneNumber: z.string().nullable().optional(),
					primaryLanguage: z.string(),
					recommenderAddress: z.string(),
					recommenderFirstName: z.string(),
					recommenderLastName: z.string(),
					recommenderPhone: z.string(),
					religion: z.string(),
					residenceType: z.string(),
					responsibilityRating: z.number(),
					schoolName: z.string(),
					schoolState: z.string(),
					schoolTown: z.string(),
					specialCircumstances: z.string(),
					stateOfOrigin: z.string(),
					studentStatement: z.string().nullable().optional(),
					supportTypesNeeded: z.array(z.string()),
					surname: z.string(),
				})
			),
			meta: FormDataReviewPaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(TacotsRecommendationSortByOptions),
			status: getOptionalEnumSchema(AdminReviewStatusOptions),
		}).optional(),
	},

	"@get/forms/tacots/recommendation/:id": {
		data: withBaseSuccessResponse({
			data: FormRecordSchema.extend({
				adminStatus: z.enum(AdminReviewStatusOptions),
				age: z.number(),
				annualHouseholdIncome: z.string(),
				avgMonthlyIncome: z.number().nullable().optional(),
				careerGoal: z.string(),
				catholicSacraments: z.array(z.string()).nullable().optional(),
				childBackgroundNotes: z.string(),
				classPositionLastTerm: z.string(),
				declarationConfirmed: z.boolean(),
				diocese: z.string().nullable().optional(),
				disciplineRating: z.number(),
				dob: z.string(),
				familyPosition: z.string(),
				fathersName: z.string(),
				fathersOccupation: z.string(),
				fathersPhone: z.string(),
				firstName: z.string(),
				gender: z.string(),
				guardianAddress: z.string().nullable().optional(),
				guardianName: z.string().nullable().optional(),
				guardianOccupation: z.string().nullable().optional(),
				guardianPhone: z.string().nullable().optional(),
				guardianRelationship: z.string().nullable().optional(),
				hasElectricity: z.string(),
				homeAddress: z.string(),
				householdSize: z.number(),
				incomeSources: z.array(z.string()),
				lastClass: z.string(),
				lastResultPublicId: z.string(),
				lastResultUrl: z.string(),
				lastTermAverage: z.number().nullable().optional(),
				lastYearAttended: z.number(),
				lga: z.string(),
				livesWith: z.string(),
				middleName: z.string().nullable().optional(),
				mothersName: z.string(),
				mothersOccupation: z.string(),
				mothersPhone: z.string(),
				nationality: z.string(),
				numIncomeEarners: z.string(),
				numSiblings: z.number(),
				otherImportantInfo: z.string().nullable().optional(),
				parentsAddress: z.string(),
				parishAttended: z.string().nullable().optional(),
				passportPhotoPublicId: z.string(),
				passportPhotoUrl: z.string(),
				phoneNumber: z.string().nullable().optional(),
				primaryLanguage: z.string(),
				recommenderAddress: z.string(),
				recommenderFirstName: z.string(),
				recommenderLastName: z.string(),
				recommenderPhone: z.string(),
				religion: z.string(),
				residenceType: z.string(),
				responsibilityRating: z.number(),
				schoolName: z.string(),
				schoolState: z.string(),
				schoolTown: z.string(),
				specialCircumstances: z.string(),
				stateOfOrigin: z.string(),
				studentStatement: z.string().nullable().optional(),
				supportTypesNeeded: z.array(z.string()),
				surname: z.string(),
			}),
		}),
		params: IdParamsSchema,
	},

	"@get/forms/tacots/tracking": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(TacotsTrackingRecordSchema),
			meta: TacotsTrackerDataPaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(TacotsTrackingRecordSortByOptions),
		}).optional(),
	},

	"@get/forms/tacots/tracking/:id": {
		data: withBaseSuccessResponse({ data: TacotsTrackingRecordSchema }),
		params: IdParamsSchema,
	},

	"@get/volunteer": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(
				FormRecordSchema.extend({
					additionalInfo: z.string().nullable().optional(),
					age: z.number(),
					ashAcademicArea: z.string().nullable().optional(),
					ashExtracurricular: z.array(z.string()).nullable().optional(),
					ashSaturdayAvailability: z.string().nullable().optional(),
					availability: z.array(z.string()),
					city: z.string(),
					commitmentDuration: z.string().nullable().optional(),
					dob: z.string(),
					emailAddress: z.string(),
					firstName: z.string(),
					gender: z.string(),
					highestEducation: z.string().nullable().optional(),
					homeAddress: z.string(),
					mediaConsent: z.boolean(),
					middleName: z.string().nullable().optional(),
					occupation: z.string().nullable().optional(),
					phoneNumber: z.string(),
					reasonForVolunteering: z.string(),
					safeguardingAgreement: z.string(),
					skillsToContribute: z.array(z.string()).nullable().optional(),
					state: z.string(),
					status: z.enum(ReviewStatusOptions),
					surname: z.string(),
					volunteerAreas: z.array(z.string()),
				})
			),
			meta: FormDataReviewPaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.extend({
			sortBy: getOptionalEnumSchema(VolunteerSortByOptions),
			status: getOptionalEnumSchema(ReviewStatusOptions),
		}).optional(),
	},

	"@get/volunteer/:id": {
		data: withBaseSuccessResponse({
			data: FormRecordSchema.extend({
				additionalInfo: z.string().nullable().optional(),
				age: z.number(),
				ashAcademicArea: z.string().nullable().optional(),
				ashExtracurricular: z.array(z.string()).nullable().optional(),
				ashSaturdayAvailability: z.string().nullable().optional(),
				availability: z.array(z.string()),
				city: z.string(),
				commitmentDuration: z.string().nullable().optional(),
				dob: z.string(),
				emailAddress: z.string(),
				firstName: z.string(),
				gender: z.string(),
				highestEducation: z.string().nullable().optional(),
				homeAddress: z.string(),
				mediaConsent: z.boolean(),
				middleName: z.string().nullable().optional(),
				occupation: z.string().nullable().optional(),
				phoneNumber: z.string(),
				reasonForVolunteering: z.string(),
				safeguardingAgreement: z.string(),
				skillsToContribute: z.array(z.string()).nullable().optional(),
				state: z.string(),
				status: z.enum(ReviewStatusOptions),
				surname: z.string(),
				volunteerAreas: z.array(z.string()),
			}),
		}),
		params: IdParamsSchema,
	},

	"@get/volunteer/all/feedback": {
		data: withBaseSuccessResponseAndMeta({
			data: z.array(
				FormRecordSchema.extend({
					activitiesInvolvedIn: z.array(z.string()).nullable().optional(),
					additionalComments: z.string().nullable().optional(),
					challengesExperienced: z.string().nullable().optional(),
					continueVolunteering: z.string().nullable().optional(),
					enjoyedMost: z.string().nullable().optional(),
					firstName: z.string(),
					improvementSuggestions: z.string().nullable().optional(),
					organizationRating: z.number(),
					overallExperienceRating: z.number(),
					programMadeImpact: z.string().nullable().optional(),
					programVolunteered: z.string(),
					roleClarityRating: z.number(),
					skillsDeveloped: z.string().nullable().optional(),
					skillsGained: z.array(z.string()).nullable().optional(),
					specificProgramDetails: z.string().nullable().optional(),
					submissionDate: z.string(),
					surname: z.string(),
					teamSupportRating: z.number(),
					volunteerDuration: z.string().nullable().optional(),
					waysProgramHelped: z.array(z.string()).nullable().optional(),
					wouldRecommend: z.string().nullable().optional(),
				})
			),
			meta: PaginatedMetaSchema,
		}),
		query: PaginatedQuerySchema.omit({ orderBy: true }).optional(),
	},

	"@get/volunteer/download/volunteerfeedback": {},

	"@get/volunteer/download/volunteerregistration": {},

	"@get/volunteer/feedback/:id": {
		data: withBaseSuccessResponse({
			data: FormRecordSchema.extend({
				activitiesInvolvedIn: z.array(z.string()).nullable().optional(),
				additionalComments: z.string().nullable().optional(),
				challengesExperienced: z.string().nullable().optional(),
				continueVolunteering: z.string().nullable().optional(),
				enjoyedMost: z.string().nullable().optional(),
				firstName: z.string(),
				improvementSuggestions: z.string().nullable().optional(),
				organizationRating: z.number(),
				overallExperienceRating: z.number(),
				programMadeImpact: z.string().nullable().optional(),
				programVolunteered: z.string(),
				roleClarityRating: z.number(),
				skillsDeveloped: z.string().nullable().optional(),
				skillsGained: z.array(z.string()).nullable().optional(),
				specificProgramDetails: z.string().nullable().optional(),
				submissionDate: z.string(),
				surname: z.string(),
				teamSupportRating: z.number(),
				volunteerDuration: z.string().nullable().optional(),
				waysProgramHelped: z.array(z.string()).nullable().optional(),
				wouldRecommend: z.string().nullable().optional(),
			}),
		}),
		params: IdParamsSchema,
	},

	"@patch/forms/ash/registration/:id/assign-mentor": {
		body: z.object({
			mentor: z.string().min(3, "Enter at least 3 characters."),
		}),
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
		params: IdParamsSchema,
	},

	"@patch/forms/ash/registration/:id/status": {
		data: withBaseSuccessResponse({ data: StatusRecordSchema }),
		params: IdParamsSchema,
		query: ReviewStatusQuerySchema,
	},

	"@patch/forms/tacots/recommendation/:id/status": {
		data: withBaseSuccessResponse({ data: StatusRecordSchema }),
		params: IdParamsSchema,
		query: AdminReviewStatusQuerySchema,
	},

	"@patch/volunteer/:id/status": {
		data: withBaseSuccessResponse({ data: VolunteerStatusRecordSchema }),
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
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
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
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
	},

	"@post/forms/ash/tracking": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
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
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
	},

	"@post/forms/outreaches": {
		body: z.object({
			activityDescription: RequiredStringSchema,
			challengesEncountered: z.string().optional(),
			impactStories: z.string().optional(),
			numBeneficiaries: stringWithNumberValidation(z.int("Enter a whole number.").min(0)),
			numVolunteers: stringWithNumberValidation(z.int("Enter a whole number.").min(0)),
			outreachCity: RequiredStringSchema,
			outreachCommunity: RequiredStringSchema,
			outreachEndDate: DateStringSchema,
			outreachLga: RequiredStringSchema,
			outreachStartDate: DateStringSchema,
			outreachState: getRequiredEnumSchema(NigeriaStateOptions),
			outreachType: getRequiredEnumArraySchema(OutreachTypeOptions),
			recommendations: z.string().optional(),
			submissionDate: DateStringSchema,
			submittedBy: RequiredStringSchema,
		}),
		data: withBaseSuccessResponse({ data: OutreachTrackerRecordSchema }),
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
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
	},

	"@post/forms/tacots/onboarding": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
	},

	"@post/forms/tacots/tracking": {
		body: z.instanceof(FormData),
		data: withBaseSuccessResponse({ data: FormRecordSchema }),
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
