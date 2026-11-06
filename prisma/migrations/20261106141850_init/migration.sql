-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'COMPANY_TUTOR', 'COORDINATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EngineeringDomain" AS ENUM ('COMPUTER_SCIENCE_IT', 'ELECTRONICS_TELECOM', 'ROBOTICS_MECHATRONICS', 'INDUSTRIAL_MANAGEMENT', 'GENERAL_ENGINEERING');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('PENDING_CONFIRMATION', 'CONFIRMED', 'REFUSED_BY_STUDENT', 'CANCELLED_BY_COMPANY');

-- CreateEnum
CREATE TYPE "ConventionStatus" AS ENUM ('DRAFT', 'GENERATED', 'SIGNED_BY_STUDENT', 'SIGNED_BY_COMPANY', 'APPROVED_BY_COORDINATOR', 'REJECTED');

-- CreateEnum
CREATE TYPE "WorkLogStatus" AS ENUM ('PENDING', 'VALIDATED_TUTOR', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "faculty" TEXT NOT NULL DEFAULT 'Facultatea de Inginerie ULBS',
    "specialization" TEXT NOT NULL,
    "study_year" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "domain" "EngineeringDomain" NOT NULL DEFAULT 'COMPUTER_SCIENCE_IT',
    "headline" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "cv_url" TEXT,
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "portfolio_url" TEXT,
    "available_from" TIMESTAMP(3),
    "available_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" "EngineeringDomain" NOT NULL DEFAULT 'COMPUTER_SCIENCE_IT',
    "is_predefined" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_tags" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "proficiency" "ProficiencyLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "cui_cif" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "contact_phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internship_offers" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "primary_domain" "EngineeringDomain" NOT NULL DEFAULT 'COMPUTER_SCIENCE_IT',
    "slots_total" INTEGER NOT NULL DEFAULT 1,
    "slots_available" INTEGER NOT NULL DEFAULT 1,
    "location" TEXT NOT NULL,
    "is_remote" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "tutor_name" TEXT NOT NULL,
    "tutor_email" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internship_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_tags" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offer_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_preferences" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_applicant_ranks" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "feedback" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_applicant_ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placements" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "status" "PlacementStatus" NOT NULL DEFAULT 'CONFIRMED',
    "matched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internship_conventions" (
    "id" TEXT NOT NULL,
    "placement_id" TEXT NOT NULL,
    "convention_number" TEXT NOT NULL,
    "status" "ConventionStatus" NOT NULL DEFAULT 'DRAFT',
    "prefilled_data" JSONB NOT NULL,
    "generated_pdf_url" TEXT,
    "signed_pdf_url" TEXT,
    "signed_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internship_conventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_logs" (
    "id" TEXT NOT NULL,
    "placement_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours_worked" INTEGER NOT NULL,
    "activity_summary" TEXT NOT NULL,
    "status" "WorkLogStatus" NOT NULL DEFAULT 'PENDING',
    "tutor_feedback" TEXT,
    "validated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_slots" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "student_id" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "meeting_link" TEXT,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_evaluations" (
    "id" TEXT NOT NULL,
    "placement_id" TEXT NOT NULL,
    "grade" DOUBLE PRECISION,
    "feedback" TEXT,
    "competencies_acquired" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "evaluator_name" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "final_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "student_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "student_tags_student_id_tag_id_key" ON "student_tags"("student_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_profiles_user_id_key" ON "company_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_profiles_cui_cif_key" ON "company_profiles"("cui_cif");

-- CreateIndex
CREATE UNIQUE INDEX "offer_tags_offer_id_tag_id_key" ON "offer_tags"("offer_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_preferences_student_id_offer_id_key" ON "student_preferences"("student_id", "offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_preferences_student_id_rank_key" ON "student_preferences"("student_id", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "company_applicant_ranks_offer_id_student_id_key" ON "company_applicant_ranks"("offer_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "placements_student_id_key" ON "placements"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "internship_conventions_placement_id_key" ON "internship_conventions"("placement_id");

-- CreateIndex
CREATE UNIQUE INDEX "internship_conventions_convention_number_key" ON "internship_conventions"("convention_number");

-- CreateIndex
CREATE UNIQUE INDEX "final_evaluations_placement_id_key" ON "final_evaluations"("placement_id");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_tags" ADD CONSTRAINT "student_tags_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_tags" ADD CONSTRAINT "student_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_offers" ADD CONSTRAINT "internship_offers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_tags" ADD CONSTRAINT "offer_tags_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "internship_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_tags" ADD CONSTRAINT "offer_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_preferences" ADD CONSTRAINT "student_preferences_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_preferences" ADD CONSTRAINT "student_preferences_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "internship_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_applicant_ranks" ADD CONSTRAINT "company_applicant_ranks_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "internship_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_applicant_ranks" ADD CONSTRAINT "company_applicant_ranks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "internship_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_conventions" ADD CONSTRAINT "internship_conventions_placement_id_fkey" FOREIGN KEY ("placement_id") REFERENCES "placements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_placement_id_fkey" FOREIGN KEY ("placement_id") REFERENCES "placements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_slots" ADD CONSTRAINT "interview_slots_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "internship_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_slots" ADD CONSTRAINT "interview_slots_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_evaluations" ADD CONSTRAINT "final_evaluations_placement_id_fkey" FOREIGN KEY ("placement_id") REFERENCES "placements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
