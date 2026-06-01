import { defineEnum, defineEnumDeep, type ExtractUnion } from "@zayne-labs/toolkit-type-helpers";
import { getNigeriaStatesAndLGA } from "@/lib/constants/nigeria";

export const GenderOptions = defineEnum(["MALE", "FEMALE"]);

export const YesNoOptions = defineEnum(["YES", "NO"]);

export const YesMaybeNoOptions = defineEnum(["YES", "MAYBE", "NO"]);

export const AshProgramTypeOptions = defineEnum(["ONLINE", "OFFLINE"]);

const NigeriaStatesAndLGAOptions = getNigeriaStatesAndLGA().map((item) => {
	const state =
		item.state === "Federal Capital Territory" ?
			"FCT"
		:	(item.state.toUpperCase() as Uppercase<typeof item.state>);

	const lgas = item.lgas;

	return defineEnumDeep({ lgas, state });
});

export const NigeriaStateOptions = NigeriaStatesAndLGAOptions.map((item) => item.state);

export const getLgaOptions = (state: ExtractUnion<typeof NigeriaStateOptions>) => {
	const foundStateAndLgas = NigeriaStatesAndLGAOptions.find((item) => item.state === state);

	return foundStateAndLgas?.lgas ?? [];
};

export const PrimaryLanguageOptions = defineEnum([
	"ENGLISH",
	"IGBO",
	"HAUSA",
	"YORUBA",
	"PIDGIN ENGLISH",
	"OTHER",
]);

export const ClassOptions = defineEnum([
	"PRIMARY 1",
	"PRIMARY 2",
	"PRIMARY 3",
	"PRIMARY 4",
	"PRIMARY 5",
	"PRIMARY 6",
	"JSS1",
	"JSS2",
	"JSS3",
	"SS1",
	"SS2",
	"SS3",
]);

export const AshFeedbackClassOptions = defineEnum([
	"PRIMARY 3",
	"PRIMARY 4",
	"PRIMARY 5",
	"PRIMARY 6",
	"JSS1",
	"JSS2",
	"JSS3",
	"SS1",
	"SS2",
	"SS3",
]);

export const AshAttendanceFrequencyOptions = defineEnum([
	"EVERY WEEK",
	"MOST WEEKS",
	"SOMETIMES",
	"RARELY",
]);
export const AshEnjoyedPartsOptions = defineEnum([
	"ACADEMIC TUTORING",
	"LITERACY",
	"NUMERACY",
	"PERFORMANCE ARTS",
	"SKILLS TRAINING",
	"MENTORSHIP",
	"GROUP ACTIVITIES",
]);

export const ParentGuardianRelationshipOptions = defineEnum(["FATHER", "MOTHER", "GUARDIAN", "RELATIVE"]);

export const AshChildBenefitedOptions = defineEnum(["YES - GREATLY", "YES - SOMEWHAT", "NOT SURE", "NO"]);

export const AcademicImprovementNoticedOptions = defineEnum([
	"YES - SIGNIFICANT",
	"YES - SOME",
	"NO NOTICEABLE CHANGE",
	"NOT SURE",
]);

export const PositiveChangeNoticedOptions = defineEnum([
	"YES - VERY POSITIVE",
	"SOME IMPROVEMENT",
	"NO CHANGE",
	"NOT SURE",
]);

export const AshMostValuableAspectsOptions = defineEnum([
	"ACADEMIC TUTORING",
	"LITERACY & NUMERACY",
	"MENTORSHIP",
	"SKILLS TRAINING",
	"PERFORMANCE ARTS",
	"POSITIVE ENVIRONMENT",
]);

export const AshGuardianRelationshipOptions = defineEnum([
	"BROTHER",
	"SISTER",
	"AUNTY",
	"UNCLE",
	"GRANDMOTHER",
	"GRANDFATHER",
	"COUSIN",
	"OTHER",
]);

export const AshHouseholdIncomeRangeOptions = defineEnum([
	"NO STABLE INCOME",
	"< ₦100K",
	"₦100K-₦300K",
	"₦300K-₦600K",
	"₦600K-₦1M",
]);
export const LearningConditionStatusOptions = defineEnum(["NO", "YES", "NOT SURE"]);
export const AshLearningConditionOptions = defineEnum([
	"LEARNING DIFFICULTY",
	"VISION IMPAIRMENT",
	"HEARING IMPAIRMENT",
	"ATTENTION DIFFICULTY",
	"PHYSICAL DISABILITY",
	"OTHER",
]);

export const TacotsRecommendationReligionOptions = defineEnum([
	"CHRISTIAN / CATHOLIC",
	"CHRISTIAN / ANGLICAN",
	"CHRISTIAN / OTHER",
	"MUSLIM",
	"OTHER RELIGIONS",
	"NO RELIGION",
]);

export const TacotsCatholicSacramentOptions = defineEnum([
	"BAPTISM",
	"FIRST HOLY COMMUNION",
	"CONFIRMATION",
	"NONE YET",
]);

export const TacotsGuardianRelationshipOptions = defineEnum([
	"GRANDPARENT",
	"AUNT/UNCLE",
	"SIBLING",
	"RELATION",
	"COMMUNITY GUARDIAN",
	"OTHER",
]);

export const TacotsFamilyPositionOptions = defineEnum([
	"1ST",
	"2ND",
	"3RD",
	"4TH",
	"5TH",
	"6TH",
	"7TH",
	"8TH",
	"9TH",
	"10TH",
	"OTHER",
]);
export const TacotsSpecialCircumstanceOptions = defineEnum([
	"ORPHAN",
	"SINGLE-PARENT",
	"LOW FAMILY INCOME",
	"NONE",
	"OTHER",
]);
export const TacotsAnnualHouseholdIncomeOptions = defineEnum([
	"NO STABLE INCOME",
	"< ₦100,000",
	"₦100,000-₦300,000",
	"₦300,001-₦600,000",
	"₦600,001-₦1,000,000",
	"ABOVE ₦1,000,000",
]);

export const TacotsIncomeSourceOptions = defineEnum([
	"FARMING",
	"TRADING / SMALL BUSINESS",
	"SALARY / FORMAL EMPLOYMENT",
	"ARTISAN / SKILLED LABOUR",
	"DAILY WAGE WORK",
	"SUPPORT FROM RELATIVE",
	"GOVERNMENT SUPPORT",
	"NO REGULAR INCOME",
	"OTHER",
]);

export const TacotsIncomeEarnerCountOptions = defineEnum(["NONE", "1", "2", "3", "MORE THAN 3"]);
export const TacotsLivesWithOptions = defineEnum([
	"BOTH PARENTS",
	"MOTHER ONLY",
	"FATHER ONLY",
	"GRANDPARENT",
	"OTHER RELATIVE",
	"GUARDIAN",
	"ALONE",
]);

export const TacotsResidenceTypeOptions = defineEnum([
	"FAMILY HOUSE",
	"RENTED APARTMENT",
	"SHARED ACCOMMODATION",
	"TEMPORARY SHELTER",
	"OTHER",
]);
export const YesNoSometimesOptions = defineEnum(["YES", "NO", "SOMETIMES"]);
export const TacotsSupportTypeOptions = defineEnum([
	"TUITION (SCHOOL FEES)",
	"SCHOOL RESOURCES",
	"TRANSPORTATION",
	"OTHER",
]);

export const TacotsFeedbackClassOptions = defineEnum([
	"PRIMARY 4",
	"PRIMARY 5",
	"PRIMARY 6",
	"JSS1",
	"JSS2",
	"JSS3",
	"SS1",
	"SS2",
	"SS3",
]);

export const TacotsScholarshipHelpedStayOptions = defineEnum([
	"YES - VERY MUCH",
	"YES - SOMEWHAT",
	"NOT SURE",
	"NO",
]);

export const TacotsMostHelpfulSupportOptions = defineEnum([
	"TUITION SUPPORT",
	"BOOKS AND LEARNING MATERIALS",
	"SCHOOL SUPPLIES",
	"MENTORSHIP",
	"ENCOURAGEMENT AND GUIDANCE",
]);

export const TacotsCurrentChallengeOptions = defineEnum([
	"DIFFICULTY UNDERSTANDING SUBJECTS",
	"FINANCIAL CHALLENGES",
	"LACK OF MATERIALS",
	"TRANSPORTATION",
	"FAMILY RESPONSIBILITIES",
	"OTHER",
]);

export const TacotsScholarshipReducedBurdenOptions = defineEnum([
	"YES - SIGNIFICANTLY",
	"YES - SOMEWHAT",
	"NOT REALLY",
	"NOT SURE",
]);

export const VolunteerHighestEducationOptions = defineEnum([
	"SECONDARY SCHOOL",
	"DIPLOMA / CERTIFICATE",
	"UNDERGRADUATE",
	"POSTGRADUATE",
	"OTHER",
]);

export const VolunteerAreaOptions = defineEnum([
	"ASH",
	"TACOTS",
	"CAPACITY BUILDING",
	"CEDAR OUTREACHES",
	"ADMINISTRATIVE SUPPORT",
]);

export const VolunteerSkillOptions = defineEnum([
	"TEACHING",
	"MENTORING",
	"PUBLIC SPEAKING",
	"CREATIVE ARTS",
	"DIGITAL / ICT",
	"WRITING",
	"PROJECT COORDINATION",
	"COMMUNITY MOBILIZATION",
	"ADMIN",
	"GRAPHICS DESIGN",
	"PHOTOGRAPHY / VIDEOGRAPHY",
	"SOCIAL MEDIA",
	"DATA MANAGEMENT",
	"OTHER",
]);

export const VolunteerAvailabilityOptions = defineEnum([
	"WEEKDAYS",
	"WEEKENDS",
	"OCCASIONAL EVENTS",
	"FLEXIBLE",
]);

export const VolunteerCommitmentDurationOptions = defineEnum([
	"3 MONTHS",
	"6 MONTHS",
	"1 YEAR",
	"MORE THAN 1 YEAR",
]);

export const VolunteerAshSaturdayAvailabilityOptions = defineEnum([
	"EVERY SATURDAY",
	"TWO SATURDAYS A MONTH",
	"ONE SATURDAY A MONTH",
	"OCCASIONALLY",
]);

export const VolunteerAshAcademicAreaOptions = defineEnum([
	"LITERACY (READING & WRITING)",
	"NUMERACY (MATHEMATICS)",
	"BOTH",
]);

export const VolunteerAshExtracurricularOptions = defineEnum([
	"DRAMA / THEATRE",
	"MUSIC / SINGING",
	"DANCE",
	"PUBLIC SPEAKING",
	"CREATIVE WRITING",
	"SPORTS / GAMES",
	"DIGITAL SKILLS",
	"ARTS AND CRAFTS",
]);

export const VolunteerFeedbackProgramOptions = defineEnum([
	"ASH",
	"TACOTS SCHOLARSHIP",
	"CAPACITY BUILDING",
	"CEDAR OUTREACHES",
]);

export const VolunteerFeedbackDurationOptions = defineEnum([
	"< 3 MONTHS",
	"3-6 MONTHS",
	"6 MONTHS-1 YEAR",
	"> 1 YEAR",
]);

export const VolunteerProgramImpactOptions = defineEnum([
	"YES - VERY STRONG",
	"YES - SOME",
	"NOT SURE",
	"NO",
]);

export const VolunteerWaysProgramHelpedOptions = defineEnum([
	"IMPROVED ACADEMIC SUPPORT",
	"STUDENT CONFIDENCE",
	"MENTORSHIP",
	"SKILLS DEVELOPMENT",
	"UNDERSERVED COMMUNITIES",
]);

export const VolunteerActivityOptions = defineEnum([
	"TEACHING / TUTORING",
	"MENTORING",
	"EXTRACURRICULAR",
	"COMMUNITY OUTREACH",
	"EVENT SUPPORT",
	"COORDINATION",
	"TRAINING",
	"OTHER",
]);

export const VolunteerSkillDevelopedOptions = defineEnum(["YES", "SOMEWHAT", "NO"]);

export const VolunteerSkillGainedOptions = defineEnum([
	"TEACHING",
	"COMMUNICATION",
	"LEADERSHIP",
	"MENTORSHIP",
	"TEAMWORK",
	"COMMUNITY ENGAGEMENT",
	"FACILITATION",
]);

export const CapacityProgramTypeOptions = defineEnum([
	"Professional Program",
	"Undergraduates Program",
	"Secondary School Program",
	"other",
]);

export const CapacitySponsorshipTypeOptions = defineEnum([
	"Financial",
	"Materials/Equipment",
	"Venue Support",
	"Technical Expertise",
	"Other",
]);

export const CapacityPartnershipLevelOptions = defineEnum([
	"Planning",
	"Funding",
	"Implementation",
	"Monitoring & Evaluation",
	"other",
]);

export const CapacityEngagementLevelOptions = defineEnum(["low", "moderate", "high"]);

export const CapacityObjectiveAchievementOptions = defineEnum([
	"Fully achieved",
	"Partially achieved",
	"Not achieved",
]);

export const CapacityYesNoOptions = defineEnum(["yes", "no"]);

export const CapacityOverallSuccessOptions = defineEnum([
	"Poor",
	"Fair",
	"Good",
	"Very Good",
	"Excellent",
]);

export const HouseholdSizeOptions = defineEnum(["2", "3", "4", "5", "6", "7", "8", "9", "10"]);

export const SiblingsOptions = defineEnum(["0", "1", "2", "3", "4", "5"]);

const currentYear = new Date().getFullYear();

export const TacotsYearOptions = [...Array(currentYear - 2000 + 1).keys()].map((index) =>
	(currentYear - index).toString()
);

export const TacotsAgeOptions = [...Array(100 - 6 + 1).keys()].map((index) => (index + 6 + 1).toString());

export const VolunteerAgeOptions = [...Array(100 - 18 + 1).keys()].map((index) => (index + 18).toString());

export const AshAgeOptions = [...Array(18 - 6 + 1).keys()].map((index) => (index + 6).toString());
