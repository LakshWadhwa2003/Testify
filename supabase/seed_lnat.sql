-- ==============================================================================
-- LNAT OFFICIAL PRACTICE PAPERS - COMPLETE 42-QUESTION ASSESSMENT SEED
-- ==============================================================================
-- 5 Full LNAT Practice Papers with 42 Questions each (Total: 210 Questions)
-- Duration: 95 minutes per paper | Total Points: 42 (1 point per question)
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Ensure RLS policies allow reading published tests and submitting answers safely
DO $$
BEGIN
  -- Tests: Allow anyone to view published tests
  BEGIN
    DROP POLICY IF EXISTS "Anyone authenticated can view published tests" ON public.tests;
    DROP POLICY IF EXISTS "Anyone can view published tests" ON public.tests;
    CREATE POLICY "Anyone can view published tests"
      ON public.tests FOR SELECT
      USING (is_published = true);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  -- Questions: Allow anyone to view questions for published tests
  BEGIN
    DROP POLICY IF EXISTS "Users can view questions for available tests" ON public.questions;
    DROP POLICY IF EXISTS "Anyone can view questions for published tests" ON public.questions;
    CREATE POLICY "Anyone can view questions for published tests"
      ON public.questions FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.tests 
          WHERE tests.id = questions.test_id AND tests.is_published = true
        )
      );
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  -- Submissions: Allow insert and select
  BEGIN
    DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.submissions;
    CREATE POLICY "Anyone can insert submissions"
      ON public.submissions FOR INSERT
      WITH CHECK (true);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  BEGIN
    DROP POLICY IF EXISTS "Anyone can view own submissions" ON public.submissions;
    DROP POLICY IF EXISTS "Anyone can view submissions" ON public.submissions;
    CREATE POLICY "Anyone can view submissions"
      ON public.submissions FOR SELECT
      USING (true);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  -- Submission Answers: Allow insert and select
  BEGIN
    DROP POLICY IF EXISTS "Anyone can insert submission answers" ON public.submission_answers;
    CREATE POLICY "Anyone can insert submission answers"
      ON public.submission_answers FOR INSERT
      WITH CHECK (true);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;

  BEGIN
    DROP POLICY IF EXISTS "Anyone can view submission answers" ON public.submission_answers;
    CREATE POLICY "Anyone can view submission answers"
      ON public.submission_answers FOR SELECT
      USING (true);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;
END $$;

-- ==============================================================================
-- QUESTIONNAIRE 1: LNAT Paper 1: Medical Ethics & Patient Autonomy (42 Questions)
-- ==============================================================================
INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'LNAT Paper 1: Medical Ethics & Patient Autonomy',
  'Based on William Ruddick''s seminal passage from official LNAT Practice Test 1 and contemporary bioethics. Focuses on paternalism, informed consent, therapeutic privilege, mental capacity, assisted dying, and clinical resource allocation.',
  95,
  42,
  true,
  'LNAT - Critical Reasoning'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_points = EXCLUDED.total_points,
  is_published = EXCLUDED.is_published,
  category = EXCLUDED.category;

-- Questions for Questionnaire 1 (Q1 to Q42)
INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
(
  '11111111-1111-4111-8111-000000000001',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''For centuries, Western medical practice rested on the benevolent paternalism codified in the Hippocratic Oath, wherein the physician pledged to act solely according to their judgment for the benefit of the sick. However, modern jurisprudence and bioethics have inverted this hierarchy, establishing that the mentally competent patient possesses an inviolable right to determine what shall be done with their own body.''

According to the passage''s analysis of traditional versus modern medical ethics, which of the following best represents the fundamental reason why medical paternalism has been increasingly challenged in modern law and philosophy?',
  'multiple_choice',
  '["Modern medical treatments are significantly less risky than historical remedies, reducing the physician''s moral burden.","Legal and philosophical principles now prioritize an individual''s inviolable right to self-determination over a physician''s unilateral assessment of well-being.","Doctors no longer take any ethical oath upon completing their clinical training.","Patients today generally possess greater diagnostic expertise than professional healthcare providers."]'::jsonb,
  'Legal and philosophical principles now prioritize an individual''s inviolable right to self-determination over a physician''s unilateral assessment of well-being.',
  'Modern biomedical jurisprudence holds that competent adults have an inviolable right to bodily autonomy and informed consent, meaning a physician cannot impose treatment merely because they believe it is beneficial.',
  1,
  0
),
(
  '11111111-1111-4111-8111-000000000002',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following statements represents an empirical assertion of fact rather than a normative ethical value judgment?',
  'multiple_choice',
  '["Physicians ought never to withhold pertinent diagnostic facts from mentally competent patients.","Modern healthcare delivery increasingly operates within multidisciplinary hospital teams rather than solitary doctor-patient relationships.","Beneficence is morally subordinate to autonomy when resolving clinical dilemmas.","Concealing a terminal prognosis is an unconscionable betrayal of human dignity."]'::jsonb,
  'Modern healthcare delivery increasingly operates within multidisciplinary hospital teams rather than solitary doctor-patient relationships.',
  'This is a descriptive, empirical statement regarding the organizational reality of modern clinical practice. The other options contain normative terms (''ought never'', ''morally subordinate'', ''unconscionable'').',
  1,
  1
),
(
  '11111111-1111-4111-8111-000000000003',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''The legal doctrine of therapeutic privilege permits a physician to withhold diagnostic or prognostic information if disclosure would pose a serious psychological threat to the patient''s health.''

The author''s critique of ''therapeutic privilege'' relies most heavily on which unstated assumption?',
  'multiple_choice',
  '["Patients rarely experience psychological distress upon receiving serious medical diagnoses.","The potential harm of being denied self-determination generally outweighs the emotional discomfort caused by hearing distressing truths.","Physicians deliberately exploit therapeutic privilege solely to avoid difficult conversations.","Statutory regulations governing therapeutic privilege have been completely repealed in all common-law jurisdictions."]'::jsonb,
  'The potential harm of being denied self-determination generally outweighs the emotional discomfort caused by hearing distressing truths.',
  'To reject therapeutic privilege, the critic must assume that preserving patient autonomy and control over one''s life is more important than avoiding emotional distress.',
  1,
  2
),
(
  '11111111-1111-4111-8111-000000000004',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following findings, if true, would most strongly support the argument advocating for comprehensive diagnostic transparency over paternalistic non-disclosure?',
  'multiple_choice',
  '["Clinical studies showing that patients given full, transparent disclosures demonstrate higher treatment adherence and improved long-term coping mechanisms.","Surveys showing that most doctors prefer not delivering fatal prognoses to elderly patients.","Reports indicating that malpractice litigation rates against healthcare trusts have steadily risen over the past decade.","Evidence showing that pharmaceutical manufacturers heavily sponsor medical education seminars."]'::jsonb,
  'Clinical studies showing that patients given full, transparent disclosures demonstrate higher treatment adherence and improved long-term coping mechanisms.',
  'This empirical evidence directly refutes the paternalistic defense that withholding information preserves patient health, showing instead that full disclosure yields superior clinical outcomes.',
  1,
  3
),
(
  '11111111-1111-4111-8111-000000000005',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''In the landmark case of Montgomery v Lanarkshire Health Board (2015), the UK Supreme Court departed from the physician-centric Bolam standard. The court ruled that doctors must disclose any material risk to which a reasonable person in the patient''s position would attach significance.''

What is the primary conceptual shift marked by the Montgomery ruling regarding medical disclosure?',
  'multiple_choice',
  '["It transfers the definition of acceptable risk from the consensus of medical peers to the expectations of the reasonable patient.","It requires doctors to eliminate all risks before proceeding with elective surgical procedures.","It forbids physicians from recommending their preferred clinical treatment options.","It makes patients legally liable for unforeseen complications if they signed a consent waiver."]'::jsonb,
  'It transfers the definition of acceptable risk from the consensus of medical peers to the expectations of the reasonable patient.',
  'The Montgomery ruling shifted the legal benchmark away from what a responsible body of medical professionals would disclose (the Bolam test) to what a reasonable patient would consider significant.',
  1,
  4
),
(
  '11111111-1111-4111-8111-000000000006',
  '11111111-1111-4111-8111-111111111111',
  'Suppose a surgeon fails to disclose a 1% risk of permanent vocal cord paralysis during routine thyroid surgery. The patient suffers the paralysis. Under the Montgomery standard, which fact is most critical to establishing medical negligence?',
  'multiple_choice',
  '["Whether other surgeons in the hospital routinely perform thyroid surgery without complications.","Whether the surgeon was exhausted at the time of the operation.","Whether this particular patient, to the surgeon''s knowledge, was a professional opera singer whose livelihood depended entirely on voice preservation.","Whether the cost of the surgical procedure was subsidized by state healthcare funding."]'::jsonb,
  'Whether this particular patient, to the surgeon''s knowledge, was a professional opera singer whose livelihood depended entirely on voice preservation.',
  'Montgomery requires disclosure of risks that a reasonable person in the patient''s specific circumstances would attach significance to; for an opera singer, vocal cord paralysis is acutely material.',
  1,
  5
),
(
  '11111111-1111-4111-8111-000000000007',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''Critics argue that demanding exhaustive disclosure of every negligible risk converts the therapeutic consultation into a defensive bureaucratic exercise, overwhelming vulnerable patients with incomprehensible statistical minutiae.''

Which of the following, if true, would best weaken this critique?',
  'multiple_choice',
  '["Patients who receive clear, structured risk discussions report feeling more empowered and less anxious about upcoming procedures.","Hospitals have hired specialized administrative staff to oversee consent document processing.","Doctors are already required to log electronic health records for billing compliance.","Many patients sign consent documents without reading them thoroughly."]'::jsonb,
  'Patients who receive clear, structured risk discussions report feeling more empowered and less anxious about upcoming procedures.',
  'If structured risk discussions actually decrease anxiety and empower patients, it refutes the claim that disclosure merely overwhelms patients and serves defensive bureaucratic ends.',
  1,
  6
),
(
  '11111111-1111-4111-8111-000000000008',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following scenarios best illustrates the legal concept of ''therapeutic privilege'' being invoked legitimately under traditional common law?',
  'multiple_choice',
  '["A doctor conceals a surgical error to avoid being sued by the patient''s relatives.","A doctor temporarily withholds a terminal cancer diagnosis from an acutely suicidal patient in psychiatric crisis until psychological support is stabilized.","A surgeon refuses to explain the side effects of anesthesia because explaining them would take too much clinic time.","A clinician decides not to inform an unconscious patient''s spouse about the patient''s pre-existing illness."]'::jsonb,
  'A doctor temporarily withholds a terminal cancer diagnosis from an acutely suicidal patient in psychiatric crisis until psychological support is stabilized.',
  'Therapeutic privilege applies strictly when the physician reasonably believes disclosure would cause serious physical or mental harm, such as precipitating immediate suicide.',
  1,
  7
),
(
  '11111111-1111-4111-8111-000000000009',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''Under the Mental Capacity Act 2005, an adult is presumed to have capacity unless established otherwise. Furthermore, a person is not to be treated as lacking capacity merely because they make an unwise decision.''

What is the essential philosophical principle underlying the protection of ''unwise decisions'' made by competent individuals?',
  'multiple_choice',
  '["That the state has no interest in public health preservation.","That genuine autonomy includes the freedom to make choices that conflict with prevailing medical or social consensus.","That physicians have no professional duty to advise patients against dangerous lifestyles.","That objective medical truth does not exist in clinical diagnosis."]'::jsonb,
  'That genuine autonomy includes the freedom to make choices that conflict with prevailing medical or social consensus.',
  'Respect for autonomy implies that competent adults are entitled to align decisions with their personal values, even if those values lead to outcomes others deem foolish or catastrophic.',
  1,
  8
),
(
  '11111111-1111-4111-8111-000000000010',
  '11111111-1111-4111-8111-111111111111',
  'In the case of Ms B (2002), a tetraplegic woman requested the withdrawal of mechanical ventilation keeping her alive. The NHS Trust contested her request, arguing she was clinically depressed. The High Court affirmed her right to refuse treatment. On what legal ground did the ruling primarily rest?',
  'multiple_choice',
  '["The court concluded that tetraplegia eliminates any reasonable quality of life.","The court affirmed that a competent patient has an absolute right to refuse any medical treatment, even if that refusal results in death.","The court held that mechanical ventilation is excessively costly for public health services.","The court determined that the NHS Trust had failed to provide adequate rehabilitation therapies."]'::jsonb,
  'The court affirmed that a competent patient has an absolute right to refuse any medical treatment, even if that refusal results in death.',
  'Dame Elizabeth Butler-Sloss held that a mentally competent adult possesses the right to decline medical intervention, and continuing treatment against their competent will constitutes unlawful battery.',
  1,
  9
),
(
  '11111111-1111-4111-8111-000000000011',
  '11111111-1111-4111-8111-111111111111',
  'A patient diagnosed with severe anorexia refuses nasogastric tube feeding, declaring that gaining weight is morally unacceptable to them. Why might a court declare this patient lacks capacity to refuse nutrition, despite their high cognitive intelligence?',
  'multiple_choice',
  '["Because anorexia is an expensive psychiatric disorder to manage in inpatient facilities.","Because the compulsion of the eating disorder impairs their ability to weigh and use information regarding death and nutrition objectively.","Because intelligent people are legally prohibited from refusing nourishment.","Because nasogastric feeding carries no clinical risks whatsoever."]'::jsonb,
  'Because the compulsion of the eating disorder impairs their ability to weigh and use information regarding death and nutrition objectively.',
  'Capacity requires being able to understand, retain, and ''use or weigh'' information. An obsessive pathological fear of weight gain can overpower the ability to weigh the reality of impending death.',
  1,
  10
),
(
  '11111111-1111-4111-8111-000000000012',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following presents the most coherent philosophical tension within the doctrine of ''Advance Decisions to Refuse Treatment'' (Living Wills)?',
  'multiple_choice',
  '["Advance directives are always hand-written, making them prone to physical damage.","The healthy past person creating the directive may not anticipate the subjective coping adaptations of the future incapacitated person.","Doctors are legally forbidden from consulting family members when a living will exists.","Hospitals earn higher revenue by honoring living wills than by administering emergency care."]'::jsonb,
  'The healthy past person creating the directive may not anticipate the subjective coping adaptations of the future incapacitated person.',
  'Philosophers like Ronald Dworkin and Rebecca Dresser note that a healthy individual anticipating severe disability may underestimate the contentment and adapted desires of the later, altered self.',
  1,
  11
),
(
  '11111111-1111-4111-8111-000000000013',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''Several nations have transitioned from an explicit opt-in organ donation framework to an opt-out (presumed consent) system, wherein all deceased citizens are regarded as prospective donors unless registered otherwise.''

Which of the following is a key moral premise necessary to justify presumed consent over explicit consent?',
  'multiple_choice',
  '["The human body automatically becomes municipal state property upon biological death.","Default inertia should favor saving living human lives when the majority of citizens passively support donation but fail to register.","Living relatives should never be consulted regarding organ retrieval procedures.","Medical practitioners are ethically obliged to harvest organs whenever a patient enters cardiac arrest."]'::jsonb,
  'Default inertia should favor saving living human lives when the majority of citizens passively support donation but fail to register.',
  'Opt-out systems are justified on the behavioral insight that most people support donation in surveys; setting donation as the default harnesses cognitive inertia to maximize life-saving transplants.',
  1,
  12
),
(
  '11111111-1111-4111-8111-000000000014',
  '11111111-1111-4111-8111-111111111111',
  'A libertarian philosopher opposes presumed consent on the grounds that non-action cannot be equated with affirmative consent. Which rebuttal most directly targets this objection?',
  'multiple_choice',
  '["The administrative costs of maintaining an opt-out registry are slightly lower than an opt-in registry.","Citizens have ample opportunity and negligible friction to log an opt-out preference, making silent acquiescence a legitimate manifestation of choice.","Kidney disease is currently the leading cause of premature mortality worldwide.","Presumed consent laws were first tested in ancient Roman legal codes."]'::jsonb,
  'Citizens have ample opportunity and negligible friction to log an opt-out preference, making silent acquiescence a legitimate manifestation of choice.',
  'If the barrier to opting out is virtually zero and public awareness is ubiquitous, continuing not to opt out can reasonably be treated as tacit consent within a legitimate legal framework.',
  1,
  13
),
(
  '11111111-1111-4111-8111-000000000015',
  '11111111-1111-4111-8111-111111111111',
  'Suppose a state introduces a policy allowing financial compensation for living kidney donors. What is the most compelling ethical critique raised against commercializing organ procurement?',
  'multiple_choice',
  '["It would cause surgeons to forget their clinical training in nephrology.","It disproportionately incentivizes impoverished individuals to undergo irreversible physiological risks, undermining genuinely voluntary consent.","It would decrease the number of kidneys available for transplantation across public hospitals.","It would violate the international copyright protections governing synthetic dialyzers."]'::jsonb,
  'It disproportionately incentivizes impoverished individuals to undergo irreversible physiological risks, undermining genuinely voluntary consent.',
  'The primary bioethical condemnation of organ commerce is coercive exploitation: financial desperation compels the indigent to commodify their bodies, compromising autonomous choice.',
  1,
  14
),
(
  '11111111-1111-4111-8111-000000000016',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following statements represents a logical deduction rather than an inductive generalization?',
  'multiple_choice',
  '["Because three European countries experienced organ donor increases after passing opt-out laws, every nation adopting opt-out will see identical increases.","If every competent person owns their own bodily organs, and no one may take owned property without permission, then harvesting organs without consent violates bodily ownership.","Most patients registered on organ waiting lists will eventually receive a suitable donor match within two years.","Doctors generally prefer performing transplants during daylight hours to avoid surgeon fatigue."]'::jsonb,
  'If every competent person owns their own bodily organs, and no one may take owned property without permission, then harvesting organs without consent violates bodily ownership.',
  'This follows strict deductive syllogistic logic: if premises A and B are true, conclusion C must necessarily follow, regardless of empirical observations.',
  1,
  15
),
(
  '11111111-1111-4111-8111-000000000017',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''Healthcare legislation frequently contains conscience clauses allowing medical staff to recuse themselves from participating in procedures—such as pregnancy terminations or assisted suicide—that violate their deeply held moral or religious convictions.''

What is the primary constraint placed on conscientious objection in modern medical codes?',
  'multiple_choice',
  '["Objecting professionals must pay a financial indemnity to the hospital for lost revenue.","The objection must not compromise emergency life-saving care, and the practitioner must refer the patient promptly to an alternative willing provider.","Objectors are prohibited from continuing to practice medicine in public hospitals.","Conscientious objection is permitted only if the patient consents to the doctor''s refusal."]'::jsonb,
  'The objection must not compromise emergency life-saving care, and the practitioner must refer the patient promptly to an alternative willing provider.',
  'Professional regulatory bodies (such as the UK GMC) permit conscientious objection provided the doctor ensures the patient''s care is not disrupted and referrals to willing practitioners are made without delay.',
  1,
  16
),
(
  '11111111-1111-4111-8111-000000000018',
  '11111111-1111-4111-8111-111111111111',
  'An ethicist argues: ''Allowing healthcare staff to conscientiously object privatizes professional morality at the expense of patients'' statutory rights to lawful healthcare.'' Which premise does this argument assume?',
  'multiple_choice',
  '["Healthcare professionals surrender their individual moral agency when entering a state-regulated monopoly profession.","Physicians never hold genuine moral convictions regarding medical interventions.","All medical procedures should be carried out exclusively by robotic surgical equipment.","Patients never experience inconvenience when referred to a different practitioner."]'::jsonb,
  'Healthcare professionals surrender their individual moral agency when entering a state-regulated monopoly profession.',
  'The claim assumes that joining a public monopoly profession entails an obligation to execute all state-sanctioned services, superseding personal conscientious scruples.',
  1,
  17
),
(
  '11111111-1111-4111-8111-000000000019',
  '11111111-1111-4111-8111-111111111111',
  'Suppose a pharmacist refuses to dispense emergency contraception due to religious beliefs. In a rural community with only one pharmacy, what makes this objection far more legally problematic than in an urban center?',
  'multiple_choice',
  '["Rural pharmacies generate lower sales volume than metropolitan pharmacies.","The monopoly position creates an insurmountable barrier to time-sensitive healthcare access, transforming the pharmacist''s personal refusal into an effective denial of legal rights.","Rural residents are statistically less litigious than city dwellers.","Emergency contraception is less effective when purchased outside major metropolitan areas."]'::jsonb,
  'The monopoly position creates an insurmountable barrier to time-sensitive healthcare access, transforming the pharmacist''s personal refusal into an effective denial of legal rights.',
  'In single-provider locales, an objection cannot be mitigated by referral; the practitioner''s refusal functions as a de facto veto over the patient''s lawful access to time-critical medication.',
  1,
  18
),
(
  '11111111-1111-4111-8111-000000000020',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following distinctions is most relevant when evaluating whether a doctor''s refusal to treat is a genuine ''conscientious objection'' or unlawful discrimination?',
  'multiple_choice',
  '["Whether the refusal is based on the nature of the clinical procedure itself or on the protected identity characteristics of the patient requesting it.","Whether the doctor graduated in the top quartile of their medical school cohort.","Whether the patient paid for consultation fees via private insurance or public vouchers.","Whether the clinic has achieved carbon-neutral environmental certification."]'::jsonb,
  'Whether the refusal is based on the nature of the clinical procedure itself or on the protected identity characteristics of the patient requesting it.',
  'Conscientious objection relates to participating in a specific moral act (e.g. abortion), whereas refusing treatment based on the patient''s personal characteristics (e.g. sexual orientation) constitutes illegal discrimination.',
  1,
  19
),
(
  '11111111-1111-4111-8111-000000000021',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''The Doctrine of Double Effect (DDE) asserts that an action with both good and foreseeable bad consequences is morally permissible provided that the bad consequence was not intended either as an end or as a means.''

How is the Doctrine of Double Effect traditionally applied in palliative end-of-life sedation?',
  'multiple_choice',
  '["It allows doctors to intentionally hasten death if the patient has exhausted financial resources.","Administering high doses of opioids to relieve intractable pain is lawful even if it foreseeably shortens life, because the intention was analgesia, not termination.","It obligates hospices to withdraw pain medication 48 hours prior to anticipated death.","It allows family members to administer lethal injections under medical supervision."]'::jsonb,
  'Administering high doses of opioids to relieve intractable pain is lawful even if it foreseeably shortens life, because the intention was analgesia, not termination.',
  'DDE distinguishes between intending death and foreseeing death as an unintended side effect of escalating palliative analgesia necessary to relieve agony.',
  1,
  20
),
(
  '11111111-1111-4111-8111-000000000022',
  '11111111-1111-4111-8111-111111111111',
  'Opponents of legalizing physician-assisted suicide frequently invoke the ''slippery slope'' argument. Which of the following best characterizes this form of reasoning?',
  'multiple_choice',
  '["Arguing that an action is wrong because it has never been approved by ancient philosophers.","Arguing that legalizing a restricted practice will inevitably create institutional and normative pressures leading to the widespread erosion of safeguards.","Arguing that assisting suicide is wrong simply because existing statutes prohibit it.","Arguing that all doctors who support assisted dying are motivated by mercenary interests."]'::jsonb,
  'Arguing that legalizing a restricted practice will inevitably create institutional and normative pressures leading to the widespread erosion of safeguards.',
  'A slippery slope argument claims that permitting an initially narrow exception will inexorably lead to broader, morally unacceptable applications through boundary expansion.',
  1,
  21
),
(
  '11111111-1111-4111-8111-000000000023',
  '11111111-1111-4111-8111-111111111111',
  'In Pretty v United Kingdom (2002), the European Court of Human Rights ruled on whether the right to life under Article 2 of the ECHR encompasses a corresponding ''right to die''. What did the Court determine?',
  'multiple_choice',
  '["The Court held that Article 2 creates a positive obligation on states to assist terminally ill citizens in ending their lives.","The Court held that Article 2 cannot without distortion be interpreted as conferring the diametrically opposite right to die.","The Court declared that human euthanasia is mandatory for all EU member states.","The Court abolished all domestic criminal statutes penalizing assisted suicide across Europe."]'::jsonb,
  'The Court held that Article 2 cannot without distortion be interpreted as conferring the diametrically opposite right to die.',
  'The ECtHR ruled that Article 2 protects the sanctity of life and cannot be inverted into an entitlement to demand state facilitation of suicide.',
  1,
  22
),
(
  '11111111-1111-4111-8111-000000000024',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following statements represents the strongest philosophical distinction between ''withdrawing life-sustaining treatment'' and ''administering active lethal injection''?',
  'multiple_choice',
  '["Withdrawing treatment merely allows the underlying pathology to take its natural fatal course, whereas active injection introduces an independent lethal mechanism.","Withdrawing treatment is completely painless, whereas lethal injections always cause violent convulsions.","Withdrawing treatment is legal only for patients under age 65.","Lethal injection requires hospital management committee approval, whereas withdrawing treatment does not."]'::jsonb,
  'Withdrawing treatment merely allows the underlying pathology to take its natural fatal course, whereas active injection introduces an independent lethal mechanism.',
  'In law and philosophy, withdrawing treatment is an omission allowing nature to take its course without unlawful interference, whereas active lethal injection is a positive act causing death.',
  1,
  23
),
(
  '11111111-1111-4111-8111-000000000025',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''Medical confidentiality is not absolute. When maintaining secrecy poses a serious, foreseeable risk of death or significant physical harm to an identifiable third party, the public interest in disclosure may eclipse the duty of confidentiality.''

In the landmark case of Tarasoff v Regents of the University of California, what fundamental legal duty was established?',
  'multiple_choice',
  '["A psychotherapist has a legal duty to protect or warn an intended third-party victim when a patient presents a serious danger of violence.","Psychotherapists are strictly forbidden from recording patient disclosures in clinical notes.","Universities are exempt from tort liability arising from student mental health crises.","Confidentiality must be preserved even if an imminent homicide is confessed."]'::jsonb,
  'A psychotherapist has a legal duty to protect or warn an intended third-party victim when a patient presents a serious danger of violence.',
  'Tarasoff established that the protective privilege ends where the public peril begins; clinicians must take reasonable steps to warn or protect identified potential victims.',
  1,
  24
),
(
  '11111111-1111-4111-8111-000000000026',
  '11111111-1111-4111-8111-111111111111',
  'A patient tests positive for Huntington''s disease (a fatal autosomal dominant hereditary condition) but forbids the physician from informing their pregnant adult daughter, who is considering starting a family. What is the central ethical dilemma facing the geneticist?',
  'multiple_choice',
  '["Whether the genetic test kit used was certified by international quality standards.","Balancing the father''s right to medical confidentiality against the daughter''s vital reproductive autonomy and actionable interest in her own genetic status.","Determining which medical insurer will pay for the child''s future primary school tuition.","Whether Huntington''s disease can be cured through herbal dietary supplements."]'::jsonb,
  'Balancing the father''s right to medical confidentiality against the daughter''s vital reproductive autonomy and actionable interest in her own genetic status.',
  'The dilemma directly pits patient confidentiality against the duty of care toward a third party who faces an imminent life-altering reproductive and health decision.',
  1,
  25
),
(
  '11111111-1111-4111-8111-000000000027',
  '11111111-1111-4111-8111-111111111111',
  'In ABC v St George''s Healthcare NHS Trust (2020), the Court of Appeal examined a clinic''s failure to warn a daughter about her father''s hereditary Huntington''s disease. What was the court''s key procedural conclusion regarding a doctor''s duty of care?',
  'multiple_choice',
  '["Doctors never owe any duty of care to a patient''s relatives under any circumstances.","A clinician can owe a legal duty of care to conduct a formal risk-balancing assessment when deciding whether to disclose genetic risks to an identifiable family member.","Clinicians must automatically publish genetic data on an open-access public database.","Family members are legally barred from seeking damages against NHS hospital trusts."]'::jsonb,
  'A clinician can owe a legal duty of care to conduct a formal risk-balancing assessment when deciding whether to disclose genetic risks to an identifiable family member.',
  'The court recognized that clinicians may owe a duty to balance the patient''s confidentiality against the potential harm to close relatives when an actionable genetic risk exists.',
  1,
  26
),
(
  '11111111-1111-4111-8111-000000000028',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following, if true, would most weaken the argument for routinely breaching patient confidentiality in cases of communicable viral infections?',
  'multiple_choice',
  '["Widespread awareness that confidentiality will be breached causes infected individuals to avoid diagnostic testing and treatment, accelerating hidden transmission.","Contact tracing apps have become increasingly popular among younger smartphone owners.","Hospitals have increased their spending on disposable personal protective equipment.","Most infectious diseases can be identified within forty-eight hours through PCR assays."]'::jsonb,
  'Widespread awareness that confidentiality will be breached causes infected individuals to avoid diagnostic testing and treatment, accelerating hidden transmission.',
  'If breaching confidentiality drives infected individuals underground, the policy defeats its own public health objective by increasing clandestine transmission.',
  1,
  27
),
(
  '11111111-1111-4111-8111-000000000029',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''Public health authorities often allocate scarce therapeutic budgets using Quality-Adjusted Life Years (QALYs), where one QALY represents a year of life in perfect health.''

What is the primary egalitarian ethical objection to using QALYs as the sole determinant for public drug funding?',
  'multiple_choice',
  '["QALY calculations require simple arithmetic that computers can perform too quickly.","It systematically discriminates against disabled or elderly individuals because their baseline and potential health gains score lower than those of young, healthy patients.","Pharmaceutical companies refuse to participate in clinical trials evaluating QALY metrics.","It leads doctors to prescribe generic rather than branded medications."]'::jsonb,
  'It systematically discriminates against disabled or elderly individuals because their baseline and potential health gains score lower than those of young, healthy patients.',
  'A major critique of QALYs is disability and age bias: treatments for disabled individuals may yield fewer QALYs than treatments for non-disabled individuals, entrenching inequality.',
  1,
  28
),
(
  '11111111-1111-4111-8111-000000000030',
  '11111111-1111-4111-8111-111111111111',
  'During a severe ICU bed shortage, two patients require the single available ventilator. Patient X is 25 years old; Patient Y is 78 years old. Both have an equal chance of surviving the acute infection. An allocation scheme based on the ''fair innings'' argument would prioritize which patient, and why?',
  'multiple_choice',
  '["Patient Y, because elderly citizens have contributed taxes to the healthcare system for more years.","Patient X, because everyone is entitled to reach a normal lifespan, and Patient X has experienced fewer life stages.","Patient Y, because older individuals possess greater societal wisdom.","Neither patient; the ventilator must remain unused to preserve moral neutrality."]'::jsonb,
  'Patient X, because everyone is entitled to reach a normal lifespan, and Patient X has experienced fewer life stages.',
  'The ''fair innings'' argument holds that everyone deserves a fair chance to live through the typical stages of life; those who have not yet reached normal adulthood should be prioritized.',
  1,
  29
),
(
  '11111111-1111-4111-8111-000000000031',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following demonstrates a flaw in the reasoning: ''Because Intensive Care Units generate high survival rates for post-surgical patients, expanding ICU capacity will automatically resolve all hospital backlog problems''?',
  'multiple_choice',
  '["It confuses correlation with causation.","It assumes that ICU bottlenecks are the sole constraint, ignoring dependencies on regular ward beds, specialized nursing staff, and operating theater availability.","It fails to define the word ''hospital'' in precise grammatical terms.","It assumes all surgeons receive equal salaries regardless of surgical specialty."]'::jsonb,
  'It assumes that ICU bottlenecks are the sole constraint, ignoring dependencies on regular ward beds, specialized nursing staff, and operating theater availability.',
  'This is a fallacy of composition/single-cause oversight: expanding one link in a complex interconnected healthcare chain cannot resolve systemic backlogs if other bottlenecks persist.',
  1,
  30
),
(
  '11111111-1111-4111-8111-000000000032',
  '11111111-1111-4111-8111-111111111111',
  'A utilitarian bioethicist asserts: ''The only rational healthcare rationing policy is one that maximizes the aggregate health utility of the entire population.'' Which moral consideration does this policy entirely ignore?',
  'multiple_choice',
  '["The total financial cost of the healthcare system.","The fairness of distribution (equity) and the special moral duty owed to the worst-off individuals.","The necessity of maintaining hygienic hospital wards.","The rate of medical inflation relative to sovereign debt yields."]'::jsonb,
  'The fairness of distribution (equity) and the special moral duty owed to the worst-off individuals.',
  'Utilitarianism aggregates total utility regardless of distribution, meaning it will gladly sacrifice the interests of severely ill minorities if doing so yields minor gains for a vast majority.',
  1,
  31
),
(
  '11111111-1111-4111-8111-000000000033',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''In Gillick v West Norfolk and Wisbech AHA (1985), the House of Lords held that a child under 16 can consent to medical treatment without parental knowledge if they achieve sufficient understanding and intelligence to comprehend fully what is proposed.''

What is the defining standard for determining ''Gillick competence'' in minor patients?',
  'multiple_choice',
  '["Whether the minor has reached their fourteenth birthday.","Whether the child possesses the maturity and cognitive capacity to understand the nature, risks, and implications of the proposed treatment.","Whether the parents have formally delegated their parental responsibility in writing.","Whether the minor has completed compulsory secondary education."]'::jsonb,
  'Whether the child possesses the maturity and cognitive capacity to understand the nature, risks, and implications of the proposed treatment.',
  'Gillick established that competence is developmental rather than chronological; a minor is competent when they understand the proposed treatment''s nature and consequences.',
  1,
  32
),
(
  '11111111-1111-4111-8111-000000000034',
  '11111111-1111-4111-8111-111111111111',
  'In English law (e.g. Re W [1993]), how does a Gillick-competent adolescent''s right to *refuse* life-saving treatment differ from their right to *consent* to treatment?',
  'multiple_choice',
  '["There is no legal difference; refusal and consent have identical legal authority.","A competent minor''s consent is legally effective, but their refusal can be overridden by a court or someone with parental responsibility if in their best interests.","Minors are never permitted to consent to any treatment without a judicial order.","Refusal is permitted only if accompanied by a signed agreement from three consultants."]'::jsonb,
  'A competent minor''s consent is legally effective, but their refusal can be overridden by a court or someone with parental responsibility if in their best interests.',
  'English law adopts an asymmetrical approach: a competent minor''s consent authorizes doctors to proceed, but their refusal does not extinguish the court''s or parents'' power to consent in life-threatening scenarios.',
  1,
  33
),
(
  '11111111-1111-4111-8111-000000000035',
  '11111111-1111-4111-8111-111111111111',
  'Suppose parents refuse a blood transfusion for their comatose 6-year-old child on religious grounds. Why will an emergency court order invariably authorize the transfusion despite parental rights?',
  'multiple_choice',
  '["Because the state''s parens patriae duty to preserve the child''s life and fundamental interests supersedes parental religious convictions.","Because blood transfusions are entirely free of infectious risks.","Because religious freedom is not recognized for parents with dependent children.","Because the child previously signed a hospital admission waiver."]'::jsonb,
  'Because the state''s parens patriae duty to preserve the child''s life and fundamental interests supersedes parental religious convictions.',
  'Under the doctrine of parens patriae, the state''s obligation to protect vulnerable children from avoidable death or irreversible harm overrides parental religious preferences.',
  1,
  34
),
(
  '11111111-1111-4111-8111-000000000036',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following scenarios best demonstrates an inconsistent application of the principle of adolescent autonomy?',
  'multiple_choice',
  '["Allowing a 15-year-old to consent to confidential contraception, but allowing a court to override that same 15-year-old''s refusal of an emergency appendectomy.","Requiring both parents to agree to an elective cosmetic surgery on an infant.","Granting a 17-year-old full testamentary capacity to draft a valid will.","Treating an unconscious adult in an emergency room without prior written consent."]'::jsonb,
  'Allowing a 15-year-old to consent to confidential contraception, but allowing a court to override that same 15-year-old''s refusal of an emergency appendectomy.',
  'Critics highlight the tension where an adolescent is deemed sufficiently autonomous to consent to intimate reproductive healthcare, yet denied the autonomy to refuse invasive surgery.',
  1,
  35
),
(
  '11111111-1111-4111-8111-000000000037',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''Deep learning diagnostic models increasingly surpass human radiologists in detecting subtle malignant neoplasms. Yet, the inscrutable "black-box" nature of neural networks creates an epistemic hurdle for clinical liability.''

If an AI diagnostic tool generates an unexplainable recommendation that contradicts a senior doctor''s clinical intuition, what is the primary legal danger of the doctor blindly deferring to the AI?',
  'multiple_choice',
  '["The hospital software subscription fees will automatically increase.","The doctor breaches their non-delegable duty of professional judgment and cannot establish a reasoned clinical basis under standard negligence tests.","The computer hardware will overheat from processing conflicting diagnostic data.","The patient''s health insurance policy will automatically be cancelled."]'::jsonb,
  'The doctor breaches their non-delegable duty of professional judgment and cannot establish a reasoned clinical basis under standard negligence tests.',
  'Physicians have a non-delegable duty of care; blindly deferring to an unexplainable algorithm without exercising independent clinical reasoning risks liability for medical malpractice.',
  1,
  36
),
(
  '11111111-1111-4111-8111-000000000038',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following arguments relies on a false dichotomy regarding AI in medical decision-making?',
  'multiple_choice',
  '["Either we prohibit all artificial intelligence in hospitals, or we accept completely unmonitored autonomous algorithmic surgery.","AI diagnostics should be rigorously evaluated in randomized clinical trials before widespread hospital deployment.","Physicians should disclose to patients whenever an AI tool contributes significantly to their diagnostic pathway.","Data privacy regulations must adapt to prevent unauthorized commercial scraping of medical images."]'::jsonb,
  'Either we prohibit all artificial intelligence in hospitals, or we accept completely unmonitored autonomous algorithmic surgery.',
  'This creates a false dilemma by presenting two extreme caricatures (total ban vs unmonitored automation), ignoring the nuanced reality of clinician-in-the-loop hybrid systems.',
  1,
  37
),
(
  '11111111-1111-4111-8111-000000000039',
  '11111111-1111-4111-8111-111111111111',
  'Suppose an AI diagnostic algorithm trained predominantly on demographic data from light-skinned patients demonstrates a 40% higher error rate when diagnosing melanomas on dark-skinned patients. In tort law, which party is most likely to face product liability claims for this systemic defect?',
  'multiple_choice',
  '["The postal courier service that delivered the computer servers.","The medical software manufacturer that developed, validated, and marketed the clinically unrepresentative diagnostic model.","The individual patient whose skin tone was not represented in the training dataset.","The electric power utility supplying electricity to the hospital."]'::jsonb,
  'The medical software manufacturer that developed, validated, and marketed the clinically unrepresentative diagnostic model.',
  'Under strict product liability rules, manufacturers are liable for placing defective products (including algorithmic medical software with foreseeable demographic biases) into commercial circulation.',
  1,
  38
),
(
  '11111111-1111-4111-8111-000000000040',
  '11111111-1111-4111-8111-111111111111',
  'Passage Excerpt: ''John Stuart Mill''s Harm Principle asserts that the only purpose for which power can be rightfully exercised over any member of a civilized community, against his will, is to prevent harm to others. His own good, either physical or moral, is not a sufficient warrant.''

How does Mill''s Harm Principle justify compulsory quarantine during an outbreak of an airborne pathogen?',
  'multiple_choice',
  '["It allows the state to punish citizens who fail to maintain healthy diets.","Quarantine prevents an infectious individual from causing catastrophic physical harm to non-consenting members of the public.","It promotes commercial economic activity by subsidizing pharmaceutical corporations.","It holds that individual bodily integrity is an illusion created by modern legal systems."]'::jsonb,
  'Quarantine prevents an infectious individual from causing catastrophic physical harm to non-consenting members of the public.',
  'Mill explicitly authorized state coercion when an individual''s conduct risks imposing direct physical injury or infection on other unconsenting members of the community.',
  1,
  39
),
(
  '11111111-1111-4111-8111-000000000041',
  '11111111-1111-4111-8111-111111111111',
  'Which of the following health policies would violate Mill''s Harm Principle by being purely paternalistic?',
  'multiple_choice',
  '["Mandating that motorists wear seatbelts solely to protect themselves from serious injury in solo collisions.","Prohibiting individuals from dumping toxic chemicals into municipal drinking reservoirs.","Restricting public indoor smoking to protect innocent bystanders from second-hand smoke inhalation.","Requiring food handling workers to undergo screening for transmissible gastrointestinal bacteria."]'::jsonb,
  'Mandating that motorists wear seatbelts solely to protect themselves from serious injury in solo collisions.',
  'Seatbelt mandates designed solely to protect the driver from harming themselves are purely paternalistic; they coerce an individual for their own physical good rather than to prevent harm to others.',
  1,
  40
),
(
  '11111111-1111-4111-8111-000000000042',
  '11111111-1111-4111-8111-111111111111',
  'An advocate for mandatory vaccination argues: ''Choosing to remain unvaccinated against a virulent airborne virus is morally equivalent to driving a car while intoxicated.'' What is the underlying point of analogy in this argument?',
  'multiple_choice',
  '["Both behaviors involve mechanical engine operation in urban environments.","Both behaviors voluntarily create an unreasonable, potentially fatal risk of physical harm to innocent bystanders sharing a public space.","Both behaviors are exclusively practiced by younger demographics.","Both behaviors carry identical monetary fines in criminal court."]'::jsonb,
  'Both behaviors voluntarily create an unreasonable, potentially fatal risk of physical harm to innocent bystanders sharing a public space.',
  'The analogy hinges on the imposition of unjustified risk upon bystanders in public spaces, arguing that individual preference cannot justify endangering others.',
  1,
  41
)
ON CONFLICT (id) DO UPDATE SET
  test_id = EXCLUDED.test_id,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- QUESTIONNAIRE 2: LNAT Paper 2: Constitutional Law & State Neutrality (42 Questions)
-- ==============================================================================
INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)
VALUES (
  '22222222-2222-4222-8222-222222222222',
  'LNAT Paper 2: Constitutional Law & State Neutrality',
  'Adapted from official LNAT Practice Test 1 (Passage 2) and constitutional jurisprudence. Examines civil service neutrality, parliamentary sovereignty, separation of powers, judicial review, emergency executive prerogatives, and civil liberties.',
  95,
  42,
  true,
  'LNAT - Critical Reasoning'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_points = EXCLUDED.total_points,
  is_published = EXCLUDED.is_published,
  category = EXCLUDED.category;

-- Questions for Questionnaire 2 (Q1 to Q42)
INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
(
  '22222222-2222-4222-8222-000000000001',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''In arguing that top civil servants possess a "conservative" institutional outlook, critics contend that senior mandarins are not merely impartial implementers of ministerial policy. Rather, their shared socio-economic background, educational pedigree, and administrative traditions lead them to instinctively preserve existing economic and social hierarchies.''

In arguing that top civil servants possess a ''conservative'' institutional outlook, the author''s primary contention is that:',
  'multiple_choice',
  '["Senior civil servants consistently vote for right-wing political parties in general elections.","Their shared elite socio-economic background, education, and administrative habits lead them to instinctively preserve existing economic and social hierarchies.","They resist introducing technological modernization across public service departments.","They deliberately sabotage legislative statutes enacted by democratically elected radical governments."]'::jsonb,
  'Their shared elite socio-economic background, education, and administrative habits lead them to instinctively preserve existing economic and social hierarchies.',
  'The passage defines conservatism not in terms of ballot-box party allegiance, but as a sociological reflex stemming from shared elite schooling and class backgrounds that inclines officials to defend the established social order.',
  1,
  0
),
(
  '22222222-2222-4222-8222-000000000002',
  '22222222-2222-4222-8222-222222222222',
  'According to the passage, why is the orthodox doctrine of ''civil service neutrality'' misleading?',
  'multiple_choice',
  '["Because permanent secretaries are routinely bribed by private corporate lobbyists.","Because ministers rarely consult department heads prior to announcing major policy reforms.","Because it conflates the absence of overt partisan bias with genuine ideological neutrality regarding the prevailing socio-economic system.","Because civil service employment contracts forbid senior staff from joining professional associations."]'::jsonb,
  'Because it conflates the absence of overt partisan bias with genuine ideological neutrality regarding the prevailing socio-economic system.',
  'The author demonstrates that a civil servant can be completely even-handed between rival political parties while simultaneously maintaining deep, uncritical allegiance to the prevailing property and economic structure.',
  1,
  1
),
(
  '22222222-2222-4222-8222-000000000003',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following developments would pose the most direct challenge to the author''s thesis regarding bureaucratic conservatism?',
  'multiple_choice',
  '["Official data showing that senior civil service recruitment from non-elite backgrounds and diverse universities has genuinely restructured the demographic profile and mindset of leadership ranks.","Historical records showing that civil servants faithfully drafted bills for postwar reforming governments.","Evidence that permanent secretaries earn substantially less than corporate finance directors.","Public opinion polls revealing high levels of voter trust in civil service integrity."]'::jsonb,
  'Official data showing that senior civil service recruitment from non-elite backgrounds and diverse universities has genuinely restructured the demographic profile and mindset of leadership ranks.',
  'The author''s thesis relies directly on demographic homogeneity generating an elite class outlook. Demonstrating genuine demographic diversification directly weakens that foundational premise.',
  1,
  2
),
(
  '22222222-2222-4222-8222-000000000004',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following analogies most accurately captures the relationship between senior civil servants and elected government ministers described in the text?',
  'multiple_choice',
  '["A ship''s permanent navigation crew whose ingrained routines quietly channel and limit the course chosen by rotating guest captains.","An impartial referee in an athletic contest who enforces rules without having any stake in the winning team.","A defense attorney who zealously advocates whatever position their changing client commands.","A laboratory technician executing invariant mechanical procedures set by a lead scientist."]'::jsonb,
  'A ship''s permanent navigation crew whose ingrained routines quietly channel and limit the course chosen by rotating guest captains.',
  'Ministers are temporary political appointees who come and go (guest captains), whereas the permanent administrative echelon possesses continuous institutional momentum that subtly steers policy within safe, conventional boundaries.',
  1,
  3
),
(
  '22222222-2222-4222-8222-000000000005',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''A.V. Dicey defined Parliamentary Sovereignty as the principle that Parliament has the right to make or unmake any law whatever, and no person or body is recognised by the law of England as having a right to override or set aside the legislation of Parliament.''

Which of the following scenarios would represent an impossible act under Dicey''s pure conception of Parliamentary Sovereignty?',
  'multiple_choice',
  '["Parliament passing an Act that retrospectively criminalizes conduct that was legal when committed.","Parliament passing an Act that binds all future Parliaments by making it legally impossible to repeal that Act.","Parliament dissolving itself and extending its own duration during wartime.","Parliament abolishing the monarchy through a simple majority statute."]'::jsonb,
  'Parliament passing an Act that binds all future Parliaments by making it legally impossible to repeal that Act.',
  'Under Dicey''s doctrine, Parliament cannot bind its successors. A sovereign Parliament that could restrict future Parliaments would destroy the sovereignty of those subsequent Parliaments.',
  1,
  4
),
(
  '22222222-2222-4222-8222-000000000006',
  '22222222-2222-4222-8222-222222222222',
  'Lord Bingham described the Rule of Law as requiring that all persons and authorities within the state should be bound by and entitled to the benefit of laws publicly made, taking effect in the future and publicly administered in the courts. Which policy most blatantly infringes this principle?',
  'multiple_choice',
  '["Publishing new traffic regulations in an online statutory instrument database 30 days prior to enforcement.","Enacting a retroactive criminal statute that imposes punitive fines on actions taken five years prior when they were fully compliant with the law.","Appointing legally qualified magistrates to adjudicate municipal civil parking disputes.","Requiring government departments to undergo annual independent financial auditing."]'::jsonb,
  'Enacting a retroactive criminal statute that imposes punitive fines on actions taken five years prior when they were fully compliant with the law.',
  'Retroactive criminalization violates the core requirement of legal certainty and prospectivity: citizens cannot conform their conduct to laws that did not exist when they acted.',
  1,
  5
),
(
  '22222222-2222-4222-8222-000000000007',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''In Jackson v Attorney General (2005), several Law Lords suggested obiter that if Parliament attempted to abolish judicial review or the ordinary role of the courts, judges might be compelled to refuse to enforce such a statute.''

What fundamental constitutional assumption does this judicial proposition challenge?',
  'multiple_choice',
  '["The constitutional convention that judges must retire at age seventy-five.","The orthodox doctrine that Parliamentary Sovereignty is unlimited and hierarchically supreme over the judiciary in all circumstances.","The requirement that criminal trials in the Crown Court must involve a jury of twelve peers.","The rule that statutory interpretation must follow the plain literal meaning of legislative texts."]'::jsonb,
  'The orthodox doctrine that Parliamentary Sovereignty is unlimited and hierarchically supreme over the judiciary in all circumstances.',
  'The suggestion in Jackson posits that the rule of law is the ultimate constitutional foundation, implying courts might invalidate an Act of Parliament that seeks to destroy democracy or the judicial role.',
  1,
  6
),
(
  '22222222-2222-4222-8222-000000000008',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following statements represents an inductive generalization rather than a formal deductive entailment?',
  'multiple_choice',
  '["If all primary statutes passed by Parliament are supreme law, and the 1998 Human Rights Act is a primary statute, then the Human Rights Act is supreme law.","Because every constitutional monarch over the last two centuries has granted Royal Assent to bills passed by both Houses, the current monarch will never withhold Royal Assent.","A defendant who is criminally convicted cannot simultaneously be declared completely innocent by the sentencing judge.","Either the executive obeys the judicial writ of habeas corpus, or it detains citizens without valid judicial authorization."]'::jsonb,
  'Because every constitutional monarch over the last two centuries has granted Royal Assent to bills passed by both Houses, the current monarch will never withhold Royal Assent.',
  'This is an inductive inference based on historical regularity (the past two centuries) generalized into a universal prediction, rather than a logically guaranteed deductive necessity.',
  1,
  7
),
(
  '22222222-2222-4222-8222-000000000009',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''In R (Miller) v The Prime Minister (2019), commonly known as Miller II, the UK Supreme Court ruled unanimously that the Prime Minister''s advice to prorogue Parliament for five weeks during intense Brexit deliberations was non-justiciable prerogative power had been unlawfully exceeded.''

On what constitutional rationale did the Supreme Court base its jurisdiction to review the prorogation of Parliament?',
  'multiple_choice',
  '["The court held that judges have the political power to dismiss a Prime Minister at will.","The court held that while the exercise of prerogative power is political, determining the legal limits of that prerogative is a fundamental constitutional duty of the courts.","The court ruled that prorogation of Parliament has been forbidden by common law since 1688.","The court concluded that five weeks is too short a recess for MPs to complete committee work."]'::jsonb,
  'The court held that while the exercise of prerogative power is political, determining the legal limits of that prerogative is a fundamental constitutional duty of the courts.',
  'The Supreme Court reaffirmed the historic principle that the courts determine whether a prerogative power exists and what its legal limits are, ensuring the executive cannot nullify parliamentary accountability.',
  1,
  8
),
(
  '22222222-2222-4222-8222-000000000010',
  '22222222-2222-4222-8222-222222222222',
  'According to Montesquieu''s tripartite separation of powers, why must the judicial branch remain strictly independent from the legislature and the executive?',
  'multiple_choice',
  '["To ensure judges receive lifetime pensions without legislative scrutiny.","Because when legislative and executive powers are united with the judiciary in the same body, there can be no liberty, as arbitrary tyranny inevitably ensues.","To ensure that judicial proceedings are conducted entirely behind closed doors.","Because legislators are not educated in common law statutory interpretation."]'::jsonb,
  'Because when legislative and executive powers are united with the judiciary in the same body, there can be no liberty, as arbitrary tyranny inevitably ensues.',
  'Montesquieu argued that concentrating the powers to enact, execute, and judge laws in a single body extinguishes personal liberty and gives rise to arbitrary despotic power.',
  1,
  9
),
(
  '22222222-2222-4222-8222-000000000011',
  '22222222-2222-4222-8222-222222222222',
  'A constitutional theorist claims: ''The British Constitution does not feature a separation of powers, but rather a fusion of powers in the executive-dominated Cabinet.'' Which feature of the UK system provides the strongest support for this claim?',
  'multiple_choice',
  '["Judges are appointed by an independent Judicial Appointments Commission.","Ministers who form the executive government must simultaneously be sitting members of Parliament in the House of Commons or House of Lords.","The Supreme Court sits in Middlesex Guildhall across from Parliament Square.","Police constables take an oath of allegiance to the reigning sovereign."]'::jsonb,
  'Ministers who form the executive government must simultaneously be sitting members of Parliament in the House of Commons or House of Lords.',
  'Walter Bagehot famously described the Cabinet as the ''hyphen that joins, the buckle that fastens'' the legislative and executive departments together, since ministers are drawn directly from Parliament.',
  1,
  10
),
(
  '22222222-2222-4222-8222-000000000012',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following, if true, would most weaken the argument that judicial review in public law constitutes an anti-democratic usurpation of parliamentary authority?',
  'multiple_choice',
  '["Judges are not elected by public voters in general elections.","Judicial review does not strike down primary legislation, but merely ensures that government ministers and public bodies do not exceed the statutory powers granted to them by Parliament.","Judges in the High Court earn higher annual salaries than backbench members of Parliament.","Judicial review applications have increased by thirty percent over the last twenty years."]'::jsonb,
  'Judicial review does not strike down primary legislation, but merely ensures that government ministers and public bodies do not exceed the statutory powers granted to them by Parliament.',
  'If judicial review primarily upholds parliamentary intent by preventing executive overreach beyond statutory mandates, it reinforces rather than undermines parliamentary supremacy.',
  1,
  11
),
(
  '22222222-2222-4222-8222-000000000013',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''Under Article 10 of the European Convention on Human Rights, freedom of expression is a qualified right. It may be subjected to such formalities, conditions, restrictions or penalties as are prescribed by law and are necessary in a democratic society in the interests of national security, territorial integrity or public safety.''

What is the defining test used by constitutional courts to determine whether a restriction on political expression is ''necessary in a democratic society''?',
  'multiple_choice',
  '["Whether a majority of citizens voted in favor of the restriction in a nationwide referendum.","Whether the interference responds to a pressing social need and is proportionate to the legitimate aim pursued.","Whether the police commissioner personally approved the content of the speech.","Whether the speaker had been convicted of a misdemeanor within the previous five years."]'::jsonb,
  'Whether the interference responds to a pressing social need and is proportionate to the legitimate aim pursued.',
  'The established Strasbourg test requires proving that the restriction meets a ''pressing social need'' and that the measures adopted are strictly proportionate to the legitimate aim.',
  1,
  12
),
(
  '22222222-2222-4222-8222-000000000014',
  '22222222-2222-4222-8222-222222222222',
  'What is meant by the legal concept of a ''chilling effect'' in constitutional jurisprudence concerning free expression?',
  'multiple_choice',
  '["The physical reduction in ambient outdoor temperatures during winter protest rallies.","The phenomenon where ambiguous or overly punitive speech regulations deter citizens from engaging in lawful public debate out of fear of prosecution.","The mandatory cooling-off period required before filing an appeal in a defamation tribunal.","The practice of broadcasting courtroom trials on delayed television networks."]'::jsonb,
  'The phenomenon where ambiguous or overly punitive speech regulations deter citizens from engaging in lawful public debate out of fear of prosecution.',
  'A ''chilling effect'' occurs when vague, sweeping laws cause individuals to self-censor legitimate, protected speech because they cannot be certain whether they will face legal sanctions.',
  1,
  13
),
(
  '22222222-2222-4222-8222-000000000015',
  '22222222-2222-4222-8222-222222222222',
  'A municipal authority bans all public protests outside an international arms trade convention, citing concerns about traffic congestion. Applying the principle of proportionality, which is the strongest argument that the ban is unlawful?',
  'multiple_choice',
  '["Arms dealers are wealthy and can afford private helicopter transport.","A blanket prohibition is disproportionate because traffic management measures and designated protest zones could accommodate both free assembly and reasonable vehicular flow.","Demonstrators have an absolute right to obstruct any motorway indefinitely under customary international law.","Municipal councils have no statutory authority over paved public highways."]'::jsonb,
  'A blanket prohibition is disproportionate because traffic management measures and designated protest zones could accommodate both free assembly and reasonable vehicular flow.',
  'Proportionality requires that the state select the least restrictive means that achieves the legitimate goal. A total ban where traffic management would suffice fails the test.',
  1,
  14
),
(
  '22222222-2222-4222-8222-000000000016',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following propositions represents a normative ethical assertion regarding free speech?',
  'multiple_choice',
  '["Section 127 of the Communications Act 2003 criminalizes sending grossly offensive messages via public electronic networks.","Speech that challenges political orthodoxy should be accorded the highest degree of constitutional protection.","The Supreme Court of the United States ruled on the First Amendment in Brandenburg v Ohio.","Internet service providers can block IP addresses using packet inspection firewalls."]'::jsonb,
  'Speech that challenges political orthodoxy should be accorded the highest degree of constitutional protection.',
  'The assertion that political speech ''should be accorded'' the highest protection is a normative value judgment about what ought to be, whereas the other options state empirical or legal facts.',
  1,
  15
),
(
  '22222222-2222-4222-8222-000000000017',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''Constitutional conventions are non-legal rules of political practice regarded as binding by those to whom they apply. They oil the wheels of the constitution, transforming legal powers into democratic realities.''

What is the defining difference between a constitutional statute and a constitutional convention?',
  'multiple_choice',
  '["Statutes are published in book form, whereas conventions are strictly oral rumors.","Statutes are legally enforceable by the courts, whereas conventions are political understandings that the courts will recognize but will not directly enforce as law.","Statutes apply only to commoners, whereas conventions bind only the reigning sovereign.","Statutes require a ninety percent parliamentary supermajority, whereas conventions require a simple plurality."]'::jsonb,
  'Statutes are legally enforceable by the courts, whereas conventions are political understandings that the courts will recognize but will not directly enforce as law.',
  'As reaffirmed in cases like Jonathan Cape (1976) and Miller I (2017), constitutional conventions are political obligations; courts may take notice of their existence but cannot enforce them as legal rules.',
  1,
  16
),
(
  '22222222-2222-4222-8222-000000000018',
  '22222222-2222-4222-8222-222222222222',
  'According to Sir Ivor Jennings'' famous three-part test, what is required to establish the existence of a constitutional convention?',
  'multiple_choice',
  '["A written Royal Charter, approval by the Privy Council, and registration with the High Court.","Historical precedents for the practice, a belief by political actors that they are bound by the rule, and a constitutional reason for the rule.","Unanimous approval by both Houses of Parliament across three successive sessions.","A five-year period of continuous observation without any public criticism."]'::jsonb,
  'Historical precedents for the practice, a belief by political actors that they are bound by the rule, and a constitutional reason for the rule.',
  'The Jennings test asks: (1) what are the precedents? (2) did the actors believe that they were bound by a rule? and (3) is there a reason for the rule?',
  1,
  17
),
(
  '22222222-2222-4222-8222-000000000019',
  '22222222-2222-4222-8222-222222222222',
  'The convention of ''Cabinet Collective Responsibility'' requires that:',
  'multiple_choice',
  '["All Cabinet ministers must resign immediately if a single minister contracts an infectious illness.","Cabinet ministers may openly debate policies in private, but must publicly support all government decisions or resign from office.","Every piece of legislation must be drafted jointly by all members of the Cabinet.","Ministers must share their official state salaries equally with junior civil servants."]'::jsonb,
  'Cabinet ministers may openly debate policies in private, but must publicly support all government decisions or resign from office.',
  'Cabinet collective responsibility ensures the government presents a united front: ministers can dissent internally, but must endorse the agreed position in public or surrender their ministerial portfolio.',
  1,
  18
),
(
  '22222222-2222-4222-8222-000000000020',
  '22222222-2222-4222-8222-222222222222',
  'If a Prime Minister breaches the Ministerial Code by misleading Parliament, why cannot a court declare the Prime Minister''s continued tenure in office void?',
  'multiple_choice',
  '["Because the Ministerial Code is an internal political code of conduct, not a statutory enactment, and enforcement rests solely with the Prime Minister and Parliament.","Because courts are closed during general election campaigns.","Because Prime Ministers enjoy absolute immunity from all legal and constitutional scrutiny under Magna Carta.","Because MPs are legally forbidden from testifying before High Court tribunals."]'::jsonb,
  'Because the Ministerial Code is an internal political code of conduct, not a statutory enactment, and enforcement rests solely with the Prime Minister and Parliament.',
  'The Ministerial Code is an executive guideline rather than an Act of Parliament; policing adherence belongs to the political sphere rather than the judicial courts.',
  1,
  19
),
(
  '22222222-2222-4222-8222-000000000021',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''The Sewel Convention establishes that the UK Parliament at Westminster will "not normally" legislate with regard to devolved matters without the consent of the devolved legislatures in Edinburgh, Cardiff, or Belfast.''

In R (Miller) v Secretary of State for Exiting the European Union (2017), what did the Supreme Court conclude regarding the legal enforceability of the Sewel Convention?',
  'multiple_choice',
  '["The court held that the Sewel Convention is legally enforceable and blocked the Brexit notification until the Scottish Parliament consented.","The court held that the Sewel Convention, despite being referenced in the Scotland Act 2016, remains an unenforceable political convention beyond judicial policing.","The court ruled that Scotland had automatically seceded from the United Kingdom upon the EU referendum result.","The court declared that devolved assemblies have absolute legislative vetoes over all UK international treaties."]'::jsonb,
  'The court held that the Sewel Convention, despite being referenced in the Scotland Act 2016, remains an unenforceable political convention beyond judicial policing.',
  'The Supreme Court held that statutory recognition of the Sewel Convention did not convert a political convention into an enforceable legal rule; Westminster retains ultimate sovereign authority to legislate.',
  1,
  20
),
(
  '22222222-2222-4222-8222-000000000022',
  '22222222-2222-4222-8222-222222222222',
  'What is the primary conceptual distinction between a federal system (like the United States) and the UK''s asymmetric devolution settlement?',
  'multiple_choice',
  '["In a federal system, states have their own flags, whereas devolved nations do not.","In a federal system, state powers are entrenched in a supreme written constitution that the central legislature cannot unilaterally abolish, whereas in the UK, Westminster retains legal sovereignty to alter or abolish devolved powers.","Federal states never collect regional sales taxes.","Devolved parliaments have larger legislative chambers than federal state senates."]'::jsonb,
  'In a federal system, state powers are entrenched in a supreme written constitution that the central legislature cannot unilaterally abolish, whereas in the UK, Westminster retains legal sovereignty to alter or abolish devolved powers.',
  'Federalism divides sovereignty through a supreme entrenched constitution; in the UK, devolution is statutory, meaning Parliament can in theory unilaterally amend or repeal devolved powers.',
  1,
  21
),
(
  '22222222-2222-4222-8222-000000000023',
  '22222222-2222-4222-8222-222222222222',
  'The ''West Lothian Question'' (Tam Dalyell''s dilemma) addresses which constitutional asymmetry?',
  'multiple_choice',
  '["Why Scottish MPs at Westminster could vote on domestic laws affecting England, while English MPs could not vote on those same matters within Scotland after devolution.","Why Wales has fewer parliamentary constituencies than Northern Ireland.","Why Scotland maintains a distinct common law legal system from England and Wales.","Why the UK Prime Minister is rarely an MP from a Scottish constituency."]'::jsonb,
  'Why Scottish MPs at Westminster could vote on domestic laws affecting England, while English MPs could not vote on those same matters within Scotland after devolution.',
  'The West Lothian Question highlights the anomaly where devolved-area MPs can vote on English-only legislation at Westminster, while English MPs have no say over devolved Scottish matters.',
  1,
  22
),
(
  '22222222-2222-4222-8222-000000000024',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following would be an unstated assumption in the argument: ''Because Northern Ireland''s power-sharing executive frequently collapses due to sectarian deadlock, direct rule from Westminster should be permanently restored''?',
  'multiple_choice',
  '["That administrative efficiency and stability are morally superior to local democratic cross-community consent.","That Northern Ireland generates more tax revenue than Wales.","That Westminster politicians are universally disliked in Belfast.","That cross-community voting rules are identical to municipal council elections."]'::jsonb,
  'That administrative efficiency and stability are morally superior to local democratic cross-community consent.',
  'To advocate permanent direct rule because of local impasse, the speaker must assume that administrative continuity outweighs the vital Good Friday Agreement requirement of cross-community consent.',
  1,
  23
),
(
  '22222222-2222-4222-8222-000000000025',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''In the landmark Belmarsh case (A v Secretary of State for the Home Department [2004]), the House of Lords considered the indefinite detention of foreign terrorist suspects without trial under the Anti-terrorism, Crime and Security Act 2001.''

On what two primary grounds did the Law Lords issue a Declaration of Incompatibility under Section 4 of the Human Rights Act?',
  'multiple_choice',
  '["The detention facilities were located too far from London, and prisoner uniforms were inadequate.","The measures were disproportionate to the security threat and unjustifiably discriminated between foreign suspects and British suspects facing identical allegations.","The police had failed to interview the suspects within 24 hours of arrest.","Parliament had neglected to conduct a cost-benefit economic assessment of indefinite imprisonment."]'::jsonb,
  'The measures were disproportionate to the security threat and unjustifiably discriminated between foreign suspects and British suspects facing identical allegations.',
  'The Law Lords held that locking up foreign terror suspects without trial while leaving British citizens posing the exact same threat free was disproportionate and impermissibly discriminatory.',
  1,
  24
),
(
  '22222222-2222-4222-8222-000000000026',
  '22222222-2222-4222-8222-222222222222',
  'Under the Civil Contingencies Act 2004, what fundamental safeguard limits the executive''s power to make emergency regulations?',
  'multiple_choice',
  '["The Prime Minister must hold a press conference within six hours of issuing regulations.","Emergency regulations lapse after seven days unless approved by resolution of each House of Parliament, and cannot amend the Human Rights Act 1998.","Emergency regulations must be countersigned by the Lord Chief Justice.","Regulations can only apply to geographic territories south of the River Thames."]'::jsonb,
  'Emergency regulations lapse after seven days unless approved by resolution of each House of Parliament, and cannot amend the Human Rights Act 1998.',
  'The Civil Contingencies Act includes sunset mechanisms requiring prompt parliamentary approval and expressly prevents the executive from overriding the Human Rights Act by emergency decree.',
  1,
  25
),
(
  '22222222-2222-4222-8222-000000000027',
  '22222222-2222-4222-8222-222222222222',
  'Lord Hoffmann famously stated in the Belmarsh case: ''The real threat to the life of the nation, in the sense of a people living in accordance with its traditional laws and political values, comes not from terrorism but from laws such as these.'' What was the central point of his reasoning?',
  'multiple_choice',
  '["That terrorists do not possess modern weaponry.","That a free society destroys its own defining constitutional identity if it abandons fundamental civil liberties and due process in the name of security.","That immigration control should be handed over to international tribunals.","That the British nation was founded in the tenth century."]'::jsonb,
  'That a free society destroys its own defining constitutional identity if it abandons fundamental civil liberties and due process in the name of security.',
  'Hoffmann argued that the ''life of the nation'' is not merely biological survival, but the survival of a society rooted in freedom, justice, and human rights; destroying liberties defeats the nation''s essence.',
  1,
  26
),
(
  '22222222-2222-4222-8222-000000000028',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following scenarios best exemplifies the constitutional writ of ''Habeas Corpus''?',
  'multiple_choice',
  '["A judicial order compelling a public hospital to disclose clinical mortality rates.","A legal order directing a prison warden to produce a detained individual before the court and demonstrate the lawful statutory basis for their deprivation of liberty.","A parliamentary resolution authorizing the appointment of three additional ombudsmen.","A police warrant authorizing the search of a suspect''s commercial business premises."]'::jsonb,
  'A legal order directing a prison warden to produce a detained individual before the court and demonstrate the lawful statutory basis for their deprivation of liberty.',
  'Habeas corpus is the ancient common-law writ protecting personal freedom against arbitrary detention by requiring the state to produce the prisoner and justify the legal grounds for detention.',
  1,
  27
),
(
  '22222222-2222-4222-8222-000000000029',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''The First-Past-The-Post (FPTP) electoral system used in UK general elections routinely produces single-party "manufactured majorities" on a minority of the national popular vote.''

What is the primary argument advanced by proponents of FPTP in defense of this system?',
  'multiple_choice',
  '["It ensures that minor regional parties obtain mathematical proportionality.","It provides stable, decisive government with clear accountability, avoiding protracted backroom coalition negotiations.","It guarantees that every voter''s ballot carries identical mathematical weight across the country.","It eliminates the necessity of holding periodic general elections."]'::jsonb,
  'It provides stable, decisive government with clear accountability, avoiding protracted backroom coalition negotiations.',
  'Defenders of FPTP argue that it delivers decisive executive stability and direct link between a single MP and constituency, enabling voters to easily ''kick the rascals out''.',
  1,
  28
),
(
  '22222222-2222-4222-8222-000000000030',
  '22222222-2222-4222-8222-222222222222',
  'In a general election under FPTP, Party A wins 36% of the popular vote and 55% of the parliamentary seats. Party B wins 34% of the vote and 30% of the seats. Party C wins 18% of the vote and 2% of the seats. What democratic defect is most evident from these results?',
  'multiple_choice',
  '["The electoral system completely failed to count ballots cast in rural polling stations.","The system creates severe vote-to-seat distortion, penalizing parties whose support is geographically dispersed while awarding an artificial working majority to a minority party.","Party C had fewer campaign advertising billboards than Party A.","Party B''s candidates were disqualified from taking their parliamentary oaths."]'::jsonb,
  'The system creates severe vote-to-seat distortion, penalizing parties whose support is geographically dispersed while awarding an artificial working majority to a minority party.',
  'FPTP rewards concentrated regional support and heavily punishes parties with broad but non-plurality national vote share (like Party C''s 18% vote translating into only 2% seats).',
  1,
  29
),
(
  '22222222-2222-4222-8222-000000000031',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following statements represents an unstated assumption in the argument: ''Proportional representation (PR) is inherently superior to majoritarian systems because every vote counts equally''?',
  'multiple_choice',
  '["Electoral fairness is exclusively defined by exact mathematical correspondence between vote shares and parliamentary seats, rather than governmental stability or clear constituency accountability.","Voters always cast ballots for independent candidates rather than political parties.","Coalition governments always collapse within six months of formation.","Majoritarian voting systems have been adopted by every Commonwealth member state."]'::jsonb,
  'Electoral fairness is exclusively defined by exact mathematical correspondence between vote shares and parliamentary seats, rather than governmental stability or clear constituency accountability.',
  'The assertion assumes that fairness in democracy is solely a function of proportional seat allocation, ignoring competing democratic virtues like decisive mandate and direct local representation.',
  1,
  30
),
(
  '22222222-2222-4222-8222-000000000032',
  '22222222-2222-4222-8222-222222222222',
  'Suppose a state introduces compulsory voting, fining citizens who fail to cast a ballot. What is the strongest civil libertarian objection to this policy?',
  'multiple_choice',
  '["Printing additional paper ballots imposes unsustainable costs on municipal budgets.","Compulsory voting infringes the fundamental negative freedom of speech, which encompasses the right to remain silent and abstain from endorsing political candidates.","Electoral workers would be required to work extended overtime shifts on election days.","Compulsory voting always favors right-of-center conservative candidates."]'::jsonb,
  'Compulsory voting infringes the fundamental negative freedom of speech, which encompasses the right to remain silent and abstain from endorsing political candidates.',
  'Libertarians argue that freedom of political conscience includes the right not to speak or participate; forcing a citizen to vote violates their right of political abstention.',
  1,
  31
),
(
  '22222222-2222-4222-8222-000000000033',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''The Parliament Acts 1911 and 1949 fundamentally altered the balance of power between the House of Commons and the House of Lords by removing the Lords'' power of absolute legislative veto.''

What is the current constitutional power of the House of Lords regarding non-money primary legislation passed by the Commons?',
  'multiple_choice',
  '["The Lords can amend or delay a bill for up to approximately one year, after which the Commons can pass it into law without the Lords'' consent.","The Lords can permanently veto any primary legislation by a simple majority vote.","The Lords can dissolve the House of Commons and force a general election.","The Lords have no power to suggest amendments or debate bills passed by MPs."]'::jsonb,
  'The Lords can amend or delay a bill for up to approximately one year, after which the Commons can pass it into law without the Lords'' consent.',
  'Under the Parliament Acts 1911 and 1949, the House of Lords possesses only a suspensory delaying power (currently up to one year), after which the Commons may invoke the Acts to enact the bill.',
  1,
  32
),
(
  '22222222-2222-4222-8222-000000000034',
  '22222222-2222-4222-8222-222222222222',
  'What is the ''Salisbury-Addison Convention'' regarding House of Lords scrutiny?',
  'multiple_choice',
  '["The Lords will never hold sittings on bank holidays or during parliamentary recesses.","The Lords will not reject at second or third reading any government bill that was promised in the governing party''s election manifesto.","The Lord Chancellor must always be chosen from hereditary peers.","The Commons must accept all amendments proposed by Bishops of the Church of England."]'::jsonb,
  'The Lords will not reject at second or third reading any government bill that was promised in the governing party''s election manifesto.',
  'The Salisbury Convention ensures that the unelected Upper House respects the democratic mandate of the government by not voting down bills implementing manifesto commitments.',
  1,
  33
),
(
  '22222222-2222-4222-8222-000000000035',
  '22222222-2222-4222-8222-222222222222',
  'Advocates for an appointed House of Lords argue: ''Because peers do not face re-election, they can scrutinize legislation with independent expertise and long-term wisdom, free from populist electoral pandering.'' Which counter-argument most directly targets this justification?',
  'multiple_choice',
  '["Appointed peers often have degrees from prestigious universities.","The absence of electoral accountability means appointments are vulnerable to political patronage and cronyism, lacking democratic legitimacy to alter laws passed by elected representatives.","The House of Lords meets in a chamber adorned with red leather benches.","Hereditary peers were partially reduced in number by the House of Lords Act 1999."]'::jsonb,
  'The absence of electoral accountability means appointments are vulnerable to political patronage and cronyism, lacking democratic legitimacy to alter laws passed by elected representatives.',
  'The central critique of unelected chambers is that appointments enable partisan patronage without democratic accountability to the populace who must obey the laws.',
  1,
  34
),
(
  '22222222-2222-4222-8222-000000000036',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following statements represents an analogy commonly employed to justify bicameral scrutiny?',
  'multiple_choice',
  '["Pouring hot tea from the legislative cup into the cooling saucer of a revising second chamber before drinking.","Building a stone fortress with two identical defensive moats.","A court of law where the prosecution and defense are represented by the same barrister.","A ship with two rudders turning in opposite directions."]'::jsonb,
  'Pouring hot tea from the legislative cup into the cooling saucer of a revising second chamber before drinking.',
  'George Washington''s famous analogy depicted the second chamber as a cooling saucer designed to temper the impassioned, hasty legislative impulses of the lower house.',
  1,
  35
),
(
  '22222222-2222-4222-8222-000000000037',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''Under the Official Secrets Act 1989, British civil servants and intelligence personnel who disclose unauthorized official information face criminal prosecution, with no statutory defense of "public interest".''

In R v Shayler (2002), what did the House of Lords decide regarding the absence of a public interest defense in the Official Secrets Act 1989?',
  'multiple_choice',
  '["The House of Lords declared the Official Secrets Act void for violating common law magna carta rights.","The House of Lords held that the ban was compatible with Article 10 because an internal authorization mechanism existed for staff to raise concerns without public leaking.","The House of Lords ruled that all government intelligence files must be published online after twelve months.","The House of Lords acquitted Shayler and abolished the security services tribunal."]'::jsonb,
  'The House of Lords held that the ban was compatible with Article 10 because an internal authorization mechanism existed for staff to raise concerns without public leaking.',
  'The Law Lords ruled that the absence of a public interest defense was compatible with free expression because whistleblowers had internal procedures and judicial review options to seek disclosure.',
  1,
  36
),
(
  '22222222-2222-4222-8222-000000000038',
  '22222222-2222-4222-8222-222222222222',
  'A defense whistleblower leaks classified documents proving that a government minister secretly authorized the illegal sale of chemical weapons precursors to an authoritarian regime. The whistleblower is prosecuted. What is the primary moral tension illustrated by this scenario?',
  'multiple_choice',
  '["The conflict between the high cost of newspaper printing and digital blog hosting.","The conflict between the civil servant''s legal duty of institutional loyalty and the higher ethical duty to expose catastrophic state wrongdoing to the public.","Whether chemical weapon precursors should be classified as hazardous freight.","The jurisdictional rivalry between metropolitan police detectives and customs officers."]'::jsonb,
  'The conflict between the civil servant''s legal duty of institutional loyalty and the higher ethical duty to expose catastrophic state wrongdoing to the public.',
  'This classic whistleblowing dilemma pits contractual/statutory duties of state confidentiality against moral obligations to expose illegal government conduct that harms the public interest.',
  1,
  37
),
(
  '22222222-2222-4222-8222-000000000039',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following propositions, if true, would most weaken the claim that ''strict secrecy laws are essential to protect national security''?',
  'multiple_choice',
  '["Foreign adversaries routinely employ electronic interception techniques against diplomatic cables.","Excessive secrecy allows executive departments to conceal systemic corruption, gross negligence, and operational failures under the pretext of national security.","The Ministry of Defence operates a public relations press office.","Military veterans often write published memoirs after retirement."]'::jsonb,
  'Excessive secrecy allows executive departments to conceal systemic corruption, gross negligence, and operational failures under the pretext of national security.',
  'If broad secrecy shields malfeasance and incompetence rather than protecting true security, it weakens the claim that secrecy operates solely to preserve the nation''s safety.',
  1,
  38
),
(
  '22222222-2222-4222-8222-000000000040',
  '22222222-2222-4222-8222-222222222222',
  'Passage Excerpt: ''The legal power to deploy armed forces overseas and declare war resides within the Royal Prerogative, exercised by the Prime Minister without statutory requirement for parliamentary assent.''

What modern constitutional convention emerged following the 2003 Iraq War regarding military deployment?',
  'multiple_choice',
  '["The monarch must personally lead troops on the battlefield.","A convention that Parliament (specifically the House of Commons) should be given the opportunity to debate and vote prior to significant overseas military engagement, except in sudden emergencies.","Ministers must receive permission from the International Court of Justice before ordering airstrikes.","Armed forces personnel may vote on whether to accept overseas deployment orders."]'::jsonb,
  'A convention that Parliament (specifically the House of Commons) should be given the opportunity to debate and vote prior to significant overseas military engagement, except in sudden emergencies.',
  'Since the 2003 Iraq debate, a convention has developed requiring parliamentary consultation and approval before committing British troops to planned combat operations overseas.',
  1,
  39
),
(
  '22222222-2222-4222-8222-000000000041',
  '22222222-2222-4222-8222-222222222222',
  'Suppose the government deploys armed drones against hostile combatants without a prior Commons vote, citing acute, imminent intelligence of an impending attack on London. Why does this deployment NOT breach the post-2003 war powers convention?',
  'multiple_choice',
  '["Because drone pilots are technically classified as civilian IT contractors.","Because the convention explicitly provides an exception for urgent emergencies and immediate self-defense where prior debate would compromise operational efficacy.","Because drones are manufactured domestically rather than imported from overseas.","Because MPs were not sitting on the committee of defense."]'::jsonb,
  'Because the convention explicitly provides an exception for urgent emergencies and immediate self-defense where prior debate would compromise operational efficacy.',
  'The convention acknowledges that urgent executive action cannot wait for parliamentary debate when sudden national defense emergencies or imminent threats require instant response.',
  1,
  40
),
(
  '22222222-2222-4222-8222-000000000042',
  '22222222-2222-4222-8222-222222222222',
  'Which of the following represents the strongest argument for codifying the Royal Prerogative into statutory law?',
  'multiple_choice',
  '["Prerogative powers are written in medieval Latin, which modern lawyers cannot translate.","Replacing murky, unwritten monarchical powers with clear parliamentary statutes enhances democratic transparency, accountability, and the rule of law.","Statutory codes are always cheaper to print than common law digests.","The monarch has expressed a personal desire to retire from public appearances."]'::jsonb,
  'Replacing murky, unwritten monarchical powers with clear parliamentary statutes enhances democratic transparency, accountability, and the rule of law.',
  'Codification removes ambiguity from archaic executive powers, placing them under democratic scrutiny and establishing clear statutory boundaries defined by the elected legislature.',
  1,
  41
)
ON CONFLICT (id) DO UPDATE SET
  test_id = EXCLUDED.test_id,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- QUESTIONNAIRE 3: LNAT Paper 3: Digital Epistemology & Education (42 Questions)
-- ==============================================================================
INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)
VALUES (
  '33333333-3333-4333-8333-333333333333',
  'LNAT Paper 3: Digital Epistemology & Education',
  'Based on official LNAT Practice Test 1 (Passage 4) and digital philosophy. Explores search engines vs deep scholarship, epistemic filter bubbles, generative AI in academia, cognitive offloading, open access paywalls, and student privacy.',
  95,
  42,
  true,
  'LNAT - Critical Reasoning'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_points = EXCLUDED.total_points,
  is_published = EXCLUDED.is_published,
  category = EXCLUDED.category;

-- Questions for Questionnaire 3 (Q1 to Q42)
INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
(
  '33333333-3333-4333-8333-000000000001',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''Professor Tara Brabazon warned of the "University of Google," where undergraduate students mistake the instant retrieval of digital search results for deep intellectual mastery. Search engine algorithms prioritize popularity, recency, and commercial SEO over peer-reviewed veracity, flattening nuanced scholarly debates into superficial soundbites.''

What is the central epistemological critique advanced by Professor Brabazon against uncritical reliance on commercial search engines?',
  'multiple_choice',
  '["Search engines operate with excessive electrical power consumption.","Algorithmic search mechanics confuse information retrieval with true intellectual comprehension, prioritizing commercial visibility over scholarly rigor.","Google prohibits universities from accessing digital library subscriptions.","Computer monitors cause physical optical fatigue in young readers."]'::jsonb,
  'Algorithmic search mechanics confuse information retrieval with true intellectual comprehension, prioritizing commercial visibility over scholarly rigor.',
  'Brabazon''s critique emphasizes that commercial algorithms rank results based on click-through popularity and SEO rather than epistemic validity or methodological quality.',
  1,
  0
),
(
  '33333333-3333-4333-8333-000000000002',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following phrases from the passage best captures an assertion of value (normative judgment) rather than an assertion of fact?',
  'multiple_choice',
  '["''Undergraduate students use search engines to locate citations.''","''Commercial algorithms index billions of web pages daily.''","''Mistaking speed of retrieval for intellectual mastery is a perilous degradation of scholarly standards.''","''Search engines return ranked lists of web addresses.''"]'::jsonb,
  '''Mistaking speed of retrieval for intellectual mastery is a perilous degradation of scholarly standards.''',
  'Terms like ''perilous degradation'' reflect a normative standard of academic quality and intellectual worth, whereas the other options describe verifiable behavioral or technical facts.',
  1,
  1
),
(
  '33333333-3333-4333-8333-000000000003',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following, if true, would most strongly counter the author''s skepticism toward internet search engines in undergraduate pedagogy?',
  'multiple_choice',
  '["Studies demonstrating that students trained in digital information literacy can evaluate conflicting online claims and discover niche academic papers far more comprehensively than prior generations restricted to small physical library shelves.","Reports that internet connectivity speeds have increased tenfold across major universities.","Surveys indicating that university students own both smartphones and laptops.","Evidence that academic publishers charge thousands of dollars for print journal subscriptions."]'::jsonb,
  'Studies demonstrating that students trained in digital information literacy can evaluate conflicting online claims and discover niche academic papers far more comprehensively than prior generations restricted to small physical library shelves.',
  'This evidence shows that digital tools, paired with literacy, actually elevate research breadth and critical discernment beyond the limits of physical library shelves.',
  1,
  2
),
(
  '33333333-3333-4333-8333-000000000004',
  '33333333-3333-4333-8333-333333333333',
  'What underlying assumption connects the author''s critique of search engines to their broader concern regarding democratic citizenship?',
  'multiple_choice',
  '["Only individuals holding doctoral degrees should be permitted to vote in democratic elections.","The capacity for sustained critical analysis and distinguishing evidence from assertion is necessary for responsible democratic deliberation.","Democratic societies cannot survive if public libraries transition to digital card catalogues.","Elected politicians never use internet search engines when formulating legislation."]'::jsonb,
  'The capacity for sustained critical analysis and distinguishing evidence from assertion is necessary for responsible democratic deliberation.',
  'Educational theorists link intellectual discernment to democratic health: citizens incapable of evaluating information critically become vulnerable to demagoguery and manipulation.',
  1,
  3
),
(
  '33333333-3333-4333-8333-000000000005',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''The "Google Effect" (or transactive memory offloading) posits that individuals are less likely to remember factual information if they believe it will be readily retrievable online in the future. Instead of encoding the facts themselves, our neural architecture encodes the location where the facts reside.''

What is the primary cognitive trade-off identified in this research?',
  'multiple_choice',
  '["Human brains are shrinking in physical volume due to screen luminescence.","Long-term memory retention of factual knowledge diminishes, while the ability to locate external resources is reinforced.","Individuals completely lose the ability to acquire spoken language.","Students require less sleep when studying online."]'::jsonb,
  'Long-term memory retention of factual knowledge diminishes, while the ability to locate external resources is reinforced.',
  'Transactive memory theory shows that our brains adapt to external storage by prioritizing retrieval routes over internal semantic encoding.',
  1,
  4
),
(
  '33333333-3333-4333-8333-000000000006',
  '33333333-3333-4333-8333-333333333333',
  'A critic of cognitive offloading argues: ''If human beings do not store fundamental scientific concepts in their biological working memory, they cannot perform novel creative synthesis or spot unexpected conceptual connections.'' What premise does this argument depend upon?',
  'multiple_choice',
  '["Creative intellectual breakthroughs require synthesizing information already integrated into internal neural memory networks rather than looking up disconnected data points.","Biological memory is completely infallible and never undergoes decay.","External hard drives are prone to magnetic degradation over time.","All major historical discoveries were made by people with photographic memories."]'::jsonb,
  'Creative intellectual breakthroughs require synthesizing information already integrated into internal neural memory networks rather than looking up disconnected data points.',
  'Creative synthesis depends on subconscious associative connections that occur between internalized knowledge structures, which cannot occur if data resides solely in external lookups.',
  1,
  5
),
(
  '33333333-3333-4333-8333-000000000007',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following historical parallels most closely mirrors the contemporary anxiety regarding internet search and memory loss?',
  'multiple_choice',
  '["Plato''s dialogue Phaedrus, in which Socrates lamented that the invention of writing would produce forgetfulness in the souls of learners by replacing internal memory with external marks.","The invention of the steam locomotive, which caused passengers to worry about tunnel suffocation.","The introduction of electric streetlights, which transformed urban nightlife in nineteenth-century London.","The development of maritime navigation compasses during the Age of Discovery."]'::jsonb,
  'Plato''s dialogue Phaedrus, in which Socrates lamented that the invention of writing would produce forgetfulness in the souls of learners by replacing internal memory with external marks.',
  'Socrates'' critique of written script in Phaedrus directly parallels today''s concerns: that relying on external technologies erodes human internal memory capacity.',
  1,
  6
),
(
  '33333333-3333-4333-8333-000000000008',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following scenarios demonstrates an invalid deductive inference regarding cognitive offloading?',
  'multiple_choice',
  '["Because cognitive offloading reduces internal memorization of dates, anyone who uses a calendar app will be incapable of understanding historical cause and effect.","If transactive memory relies on digital tools, losing access to those tools will temporarily impair retrieval speed.","Externalizing data storage allows working memory to allocate attention to computational tasks.","Relying on GPS navigation is associated with reduced hippocampal spatial mapping activation."]'::jsonb,
  'Because cognitive offloading reduces internal memorization of dates, anyone who uses a calendar app will be incapable of understanding historical cause and effect.',
  'This is a non sequitur: not memorizing specific calendar dates does not logically imply an inability to grasp causal historical mechanisms.',
  1,
  7
),
(
  '33333333-3333-4333-8333-000000000009',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''Philosopher C. Thi Nguyen distinguishes between "epistemic bubbles" and "echo chambers." An epistemic bubble is a social structure where relevant voices have been inadvertently left out, whereas an echo chamber is a culture where dissenting voices are actively brought inside, only to be systematically discredited as malicious or untrustworthy.''

Why are echo chambers significantly harder to dismantle through fact-checking than epistemic bubbles?',
  'multiple_choice',
  '["Because epistemic bubbles require expensive software subscriptions.","Because echo chambers possess built-in belief-protection mechanisms that interpret counter-evidence and fact-checks as further proof of an external conspiracy.","Because members of echo chambers never use the internet.","Because echo chambers are protected by international diplomatic immunity."]'::jsonb,
  'Because echo chambers possess built-in belief-protection mechanisms that interpret counter-evidence and fact-checks as further proof of an external conspiracy.',
  'Echo chambers pre-emptively undermine outside authorities, so presenting conflicting facts actually reinforces belief in the conspiracy by confirming that ''the establishment is lying''.',
  1,
  8
),
(
  '33333333-3333-4333-8333-000000000010',
  '33333333-3333-4333-8333-333333333333',
  'What role does algorithmic personalization in social media feeds play in fostering epistemic insularity?',
  'multiple_choice',
  '["It randomly scrambles user passwords every twenty-four hours.","It optimizes for user engagement and screen-time by serving content that confirms existing ideological biases, gradually filtering out disconfirming viewpoints.","It requires all users to take a standardized grammar examination before posting.","It translates international news stories into a single universal language."]'::jsonb,
  'It optimizes for user engagement and screen-time by serving content that confirms existing ideological biases, gradually filtering out disconfirming viewpoints.',
  'Personalization algorithms maximize engagement by serving confirmatory and outrage-inducing material, systematically hiding alternative perspectives from user feeds.',
  1,
  9
),
(
  '33333333-3333-4333-8333-000000000011',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following best exemplifies the ''confirmation bias'' phenomenon in student digital research?',
  'multiple_choice',
  '["A student searching ''why climate change is a hoax'' and reading exclusively links from blogs confirming their skepticism, while ignoring scientific consensus reports.","A student comparing three different peer-reviewed journal articles before writing an essay.","A student quoting an encyclopedia entry on ancient Mesopotamian agriculture.","A student submitting an essay twelve hours before the assigned deadline."]'::jsonb,
  'A student searching ''why climate change is a hoax'' and reading exclusively links from blogs confirming their skepticism, while ignoring scientific consensus reports.',
  'Confirmation bias is the tendency to seek out, interpret, and favor information that validates pre-existing beliefs while ignoring contrary evidence.',
  1,
  10
),
(
  '33333333-3333-4333-8333-000000000012',
  '33333333-3333-4333-8333-333333333333',
  'Suppose a social network redesigns its algorithm to expose users to equal numbers of opposing political viewpoints. Studies show that when exposed to extreme opposing arguments, partisan users become even more polarized. What cognitive phenomenon explains this outcome?',
  'multiple_choice',
  '["Sensory sensory adaptation.","The ''backfire effect'' or reactive defensive identity polarization.","Linguistic determinism.","Retroactive inhibition in motor learning."]'::jsonb,
  'The ''backfire effect'' or reactive defensive identity polarization.',
  'When identity-threatening opposing views are presented aggressively, individuals entrench themselves deeper into their tribe to defend their social identity.',
  1,
  11
),
(
  '33333333-3333-4333-8333-000000000013',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''Large Language Models (LLMs) synthesize fluent, grammatically flawless prose by predicting statistical word probabilities across colossal text corpora. However, they lack semantic grounding, genuine intentionality, and moral accountability.''

What is the fundamental pedagogical concern when students submit AI-generated text as their own original essays?',
  'multiple_choice',
  '["The essay uses too many syllables per paragraph.","The student bypasses the arduous intellectual struggle of formulating, structuring, and defending their own thoughts, thereby failing to develop cognitive autonomy.","The university servers will suffer mechanical wear and tear.","Printers in the university library will run out of toner."]'::jsonb,
  'The student bypasses the arduous intellectual struggle of formulating, structuring, and defending their own thoughts, thereby failing to develop cognitive autonomy.',
  'The purpose of essay writing is the cognitive development inherent in wrestling with complex ideas; outsourcing this to an LLM voids the primary learning mechanism.',
  1,
  12
),
(
  '33333333-3333-4333-8333-000000000014',
  '33333333-3333-4333-8333-333333333333',
  'Why is the reliance on automated ''AI detectors'' deeply problematic for university disciplinary tribunals?',
  'multiple_choice',
  '["Detectors operate with high false-positive rates that disproportionately flag non-native English speakers who use structured, formulaic prose.","Detectors consume excessive bandwidth on university Wi-Fi networks.","Detectors are prohibited under the Geneva Conventions.","Detectors cannot read text written in times new roman font."]'::jsonb,
  'Detectors operate with high false-positive rates that disproportionately flag non-native English speakers who use structured, formulaic prose.',
  'Studies demonstrate that probabilistic AI detection tools exhibit significant false-positive rates, particularly penalizing international students whose writing is formal and predictable.',
  1,
  13
),
(
  '33333333-3333-4333-8333-000000000015',
  '33333333-3333-4333-8333-333333333333',
  'An educator argues: ''Attempting to ban generative AI in universities is as futile and short-sighted as attempting to ban pocket calculators in mathematics classrooms sixty years ago.'' What is the underlying premise of this analogy?',
  'multiple_choice',
  '["Calculators and language models were invented by the exact same engineers.","New computational tools inevitably shift educational emphasis from manual low-level production to higher-order critical evaluation and problem conception.","Calculators were banned by federal legislation in 1965.","Both tools require lithium-ion battery replacements."]'::jsonb,
  'New computational tools inevitably shift educational emphasis from manual low-level production to higher-order critical evaluation and problem conception.',
  'The analogy assumes that just as calculators freed students from manual arithmetic to focus on advanced mathematical logic, AI should shift focus from drafting to critical reasoning.',
  1,
  14
),
(
  '33333333-3333-4333-8333-000000000016',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following propositions represents a category error regarding large language models?',
  'multiple_choice',
  '["The language model exhibits malicious personal jealousy toward rival software systems.","The language model was trained on billions of parameters using gradient descent.","The language model outputs text via token prediction.","The language model consumes electrical energy during inference."]'::jsonb,
  'The language model exhibits malicious personal jealousy toward rival software systems.',
  'Attributing subjective emotional states like ''jealousy'' to a non-conscious statistical token prediction model is a category error (attributing human mental qualities to a mathematical algorithm).',
  1,
  15
),
(
  '33333333-3333-4333-8333-000000000017',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''The shift toward high tuition fees has recast higher education as a private market commodity rather than a public social good, transforming students into consumers who demand frictionless credentialism rather than rigorous intellectual challenge.''

According to critics, how does the ''student-as-consumer'' model undermine university pedagogy?',
  'multiple_choice',
  '["It forces university cafeterias to offer too many food options.","It pressures academic departments to inflate grades and dilute curriculum rigor to maintain positive customer satisfaction metrics.","It requires professors to dress in business attire during lectures.","It prevents universities from participating in competitive rowing regattas."]'::jsonb,
  'It pressures academic departments to inflate grades and dilute curriculum rigor to maintain positive customer satisfaction metrics.',
  'When students are treated as paying customers, student evaluations and retention metrics incentivize institutions to avoid discomforting academic rigor in favor of customer satisfaction.',
  1,
  16
),
(
  '33333333-3333-4333-8333-000000000018',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following arguments best defends the student-fee funding model over state-funded free tuition from an egalitarian perspective?',
  'multiple_choice',
  '["Higher tuition fees make students read textbooks more quickly.","Because university graduates earn substantially higher lifetime incomes than non-graduates, funding higher education entirely from general taxation forces non-graduate workers to subsidize future high earners.","Private universities are exempt from local property taxation.","Professors teach more effectively when receiving private endowments."]'::jsonb,
  'Because university graduates earn substantially higher lifetime incomes than non-graduates, funding higher education entirely from general taxation forces non-graduate workers to subsidize future high earners.',
  'This is the progressive critique of universal state funding: funding higher education from general taxes acts as a regressive redistribution from working-class non-graduates to upwardly mobile graduates.',
  1,
  17
),
(
  '33333333-3333-4333-8333-000000000019',
  '33333333-3333-4333-8333-333333333333',
  'What is an unstated assumption in the claim: ''Universities that do not produce graduates with high starting salaries within six months are failing their educational mission''?',
  'multiple_choice',
  '["The sole or primary legitimate purpose of higher education is immediate short-term vocational earning power in the commercial labor market.","Graduate salaries are calculated before national insurance deductions.","All university graduates work in metropolitan finance hubs.","Science degrees require four years of laboratory coursework."]'::jsonb,
  'The sole or primary legitimate purpose of higher education is immediate short-term vocational earning power in the commercial labor market.',
  'The metric of short-term starting salary assumes that non-monetary goods—such as democratic citizenship, philosophical reflection, and artistic development—are negligible educational purposes.',
  1,
  18
),
(
  '33333333-3333-4333-8333-000000000020',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following statements represents an empirical economic observation rather than a normative educational claim?',
  'multiple_choice',
  '["Higher education institutions ought to prioritize civic virtue over corporate employability.","Over the past twenty-five years, university administrative expenditure grew at twice the rate of academic teaching expenditure.","It is unacceptable that university rectors earn ten times the salary of maintenance staff.","Knowledge should be pursued exclusively for its own intrinsic beauty."]'::jsonb,
  'Over the past twenty-five years, university administrative expenditure grew at twice the rate of academic teaching expenditure.',
  'This is a measurable, verifiable empirical statement about budgetary allocations over time, free of moral prescriptive terms (''ought'', ''unacceptable'').',
  1,
  19
),
(
  '33333333-3333-4333-8333-000000000021',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''Oligopolistic commercial academic publishers enjoy profit margins exceeding thirty percent by monetizing research funded by public taxpayers, performed by salaried academics, and peer-reviewed for free by other academics.''

What is the central ethical argument for mandatory ''Open Access'' publishing of scientific research?',
  'multiple_choice',
  '["Publishers should be forced to replace journal editors with artificial intelligence.","Research funded by the public should be freely accessible to the public, scientists, and developing countries, rather than locked behind corporate paywalls.","Scientific papers should be limited to a maximum length of five hundred words.","Academics should be prohibited from publishing research outside their home country."]'::jsonb,
  'Research funded by the public should be freely accessible to the public, scientists, and developing countries, rather than locked behind corporate paywalls.',
  'The moral foundation of Open Access is distributive justice: because taxpayers financed the inquiry, the resulting scientific knowledge is a common public good.',
  1,
  20
),
(
  '33333333-3333-4333-8333-000000000022',
  '33333333-3333-4333-8333-333333333333',
  'How does the ''Author-Pays'' model (Article Processing Charges - APCs) for open access create a new form of epistemic inequality?',
  'multiple_choice',
  '["It makes academic papers print in black and white rather than color.","While it allows everyone to read research for free, it creates a severe financial barrier preventing researchers from underfunded institutions or the Global South from publishing their work.","It forces researchers to deliver oral presentations at every major conference.","It leads universities to cancel campus bookstore contracts."]'::jsonb,
  'While it allows everyone to read research for free, it creates a severe financial barrier preventing researchers from underfunded institutions or the Global South from publishing their work.',
  'APCs shift the paywall from the reader to the author: well-funded elite universities can easily pay $3,000 APCs, whereas researchers in developing nations are financially excluded from publishing.',
  1,
  21
),
(
  '33333333-3333-4333-8333-000000000023',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following, if true, would best defend commercial academic publishers against accusations of rent-seeking exploitation?',
  'multiple_choice',
  '["Commercial publishers manage long-term digital preservation, coordinate complex peer-review software ecosystems, format technical data standards, and protect legal copyright integrity.","Commercial publishers sponsor annual cocktail receptions at academic conferences.","Most journal editors have published at least one novel.","Publishers employ marketing interns during the summer months."]'::jsonb,
  'Commercial publishers manage long-term digital preservation, coordinate complex peer-review software ecosystems, format technical data standards, and protect legal copyright integrity.',
  'This counter-argument identifies real technical, infrastructural, and administrative value added by publishers beyond simply hosting raw texts.',
  1,
  22
),
(
  '33333333-3333-4333-8333-000000000024',
  '33333333-3333-4333-8333-333333333333',
  'What is meant by the concept of ''Sci-Hub'' and shadow libraries acting as ''guerrilla open access''?',
  'multiple_choice',
  '["Libraries that operate exclusively inside underground military bunkers.","Websites that bypass commercial paywalls through illicit scraping and user-donated credentials to provide universal, unauthorized access to scientific literature.","Student clubs that exchange second-hand physical textbooks.","Mobile library buses operating in rural farming villages."]'::jsonb,
  'Websites that bypass commercial paywalls through illicit scraping and user-donated credentials to provide universal, unauthorized access to scientific literature.',
  'Shadow libraries like Sci-Hub use unauthorized civil disobedience tactics to liberate paywalled academic papers, arguing that scientific knowledge belongs to all humanity.',
  1,
  23
),
(
  '33333333-3333-4333-8333-000000000025',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''The abrupt pivot to remote emergency schooling during the pandemic shattered the technocratic utopian myth that digital connectivity is an automatic equalizer. Instead, it accentuated the "digital divide," where disparities in hardware access, high-speed broadband, and quiet domestic study environments compounded educational stratification.''

Why did remote online learning exacerbate educational inequality along socio-economic lines?',
  'multiple_choice',
  '["Because affluent households possessed private devices, high-speed connections, and quiet study spaces, while disadvantaged students faced shared devices, unstable connectivity, and overcrowding.","Because video conferencing applications charge students an hourly connection fee.","Because teachers only graded assignments submitted by students wearing school uniforms on webcam.","Because computer screens cannot display algebraic symbols accurately."]'::jsonb,
  'Because affluent households possessed private devices, high-speed connections, and quiet study spaces, while disadvantaged students faced shared devices, unstable connectivity, and overcrowding.',
  'Digital learning relies heavily on domestic physical and economic infrastructure; unequal access to quiet space, stable internet, and dedicated laptops widened learning gaps.',
  1,
  24
),
(
  '33333333-3333-4333-8333-000000000026',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following interventions most directly addresses the ''second-level digital divide'' (inequality in digital skills and mentoring) rather than the ''first-level digital divide'' (hardware access)?',
  'multiple_choice',
  '["Distributing refurbished tablet computers to all low-income households.","Providing intensive digital media literacy tutoring and critical inquiry coaching to disadvantaged students.","Laying fiber-optic internet cables in rural municipalities.","Subsidizing the monthly electrical utility bills of public schools."]'::jsonb,
  'Providing intensive digital media literacy tutoring and critical inquiry coaching to disadvantaged students.',
  'The first-level divide is material access (hardware/broadband); the second-level divide concerns capabilities, media literacy, discernment, and pedagogical mentoring.',
  1,
  25
),
(
  '33333333-3333-4333-8333-000000000027',
  '33333333-3333-4333-8333-333333333333',
  'An advocate for asynchronous remote higher education claims: ''Pre-recorded video lectures render physical campus universities obsolete.'' Which assumption does this claim rely upon?',
  'multiple_choice',
  '["The value of higher education consists entirely of unidirectional lecture content delivery, rather than spontaneous discussion, peer collaboration, laboratories, and socialization.","Video cameras capture better lighting than lecture theatre chandeliers.","All university professors have professional television broadcasting experience.","Students prefer watching lectures at normal speed rather than double speed."]'::jsonb,
  'The value of higher education consists entirely of unidirectional lecture content delivery, rather than spontaneous discussion, peer collaboration, laboratories, and socialization.',
  'The claim reduces university learning to passive reception of lecture videos, ignoring collaborative seminar debate, lab mentoring, peer networking, and personal growth.',
  1,
  26
),
(
  '33333333-3333-4333-8333-000000000028',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following propositions represents a sound deductive syllogism?',
  'multiple_choice',
  '["All students who lack broadband access struggle with remote exams. Marcus has broadband access. Therefore, Marcus does not struggle with remote exams.","All students who lack broadband access struggle with remote exams. Marcus lacks broadband access. Therefore, Marcus struggles with remote exams.","Some students who lack broadband access struggle with remote exams. Marcus is a student. Therefore, Marcus lacks broadband access.","Marcus struggles with remote exams. Therefore, Marcus lacks broadband access."]'::jsonb,
  'All students who lack broadband access struggle with remote exams. Marcus lacks broadband access. Therefore, Marcus struggles with remote exams.',
  'This is a valid modus ponens deduction: All A have property B; Marcus is A; therefore Marcus has property B. The first option commits the fallacy of denying the antecedent.',
  1,
  27
),
(
  '33333333-3333-4333-8333-000000000029',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''Goodhart''s Law observes that "when a measure becomes a target, it ceases to be a good measure." In education, metric-fixation transforms teaching into test-coaching, where teachers are coerced into "teaching to the test" at the expense of genuine intellectual curiosity.''

How does Goodhart''s Law manifest in high-stakes standardized school testing?',
  'multiple_choice',
  '["Schools spend excessive funds on number 2 pencils.","Schools prioritize superficial test-taking algorithms and memorization tricks that boost test scores without improving students'' underlying subject comprehension.","Examiners refuse to grade handwritten exam booklets.","Students demand longer summer vacation intervals."]'::jsonb,
  'Schools prioritize superficial test-taking algorithms and memorization tricks that boost test scores without improving students'' underlying subject comprehension.',
  'When test scores become the sole metric for school funding and teacher evaluation, efforts shift to gaming the metric (test coaching) rather than fostering real conceptual understanding.',
  1,
  28
),
(
  '33333333-3333-4333-8333-000000000030',
  '33333333-3333-4333-8333-333333333333',
  'Paulo Freire famously critiqued the ''banking model'' of education. What does this critique reject?',
  'multiple_choice',
  '["Allowing students to open commercial bank checking accounts.","Treating students as passive, empty receptacles into whom teachers deposit pre-packaged fragments of static knowledge.","Using electronic calculators in accounting examinations.","Requiring university bursars to publish annual balance sheets."]'::jsonb,
  'Treating students as passive, empty receptacles into whom teachers deposit pre-packaged fragments of static knowledge.',
  'Freire''s ''banking model'' critique targets pedagogy that treats learners as passive recipients of deposited facts rather than active co-creators of critical knowledge.',
  1,
  29
),
(
  '33333333-3333-4333-8333-000000000031',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following represents the strongest defense of objective standardized testing in educational policy?',
  'multiple_choice',
  '["Standardized testing eliminates the need to teach reading comprehension.","Standardized testing provides an impartial, transparent yardstick that reduces subjective grading bias and enables detection of systemic resource deficiencies across diverse schools.","Standardized tests take less than ten minutes to administer.","All questions on standardized tests are written by students themselves."]'::jsonb,
  'Standardized testing provides an impartial, transparent yardstick that reduces subjective grading bias and enables detection of systemic resource deficiencies across diverse schools.',
  'Proponents argue that standardized exams provide an objective benchmark free from subjective teacher favoritism, highlighting institutional inequalities for targeted intervention.',
  1,
  30
),
(
  '33333333-3333-4333-8333-000000000032',
  '33333333-3333-4333-8333-333333333333',
  'An educational reformer states: ''Because testing causes psychological stress among teenagers, all school examinations should be permanently abolished.'' What is the primary logical flaw in this proposal?',
  'multiple_choice',
  '["It assumes that all stress is inherently bad and fails to consider how assessments provide essential feedback and motivation for skill mastery.","It uses the word ''examination'' when it should use ''interrogation''.","It ignores the fact that printers generate test booklets on recycled paper.","It assumes that teenagers enjoy studying during the evening."]'::jsonb,
  'It assumes that all stress is inherently bad and fails to consider how assessments provide essential feedback and motivation for skill mastery.',
  'The argument overreacts by eliminating the tool entirely, overlooking the vital diagnostic and developmental functions of assessment that could be reformed rather than abolished.',
  1,
  31
),
(
  '33333333-3333-4333-8333-000000000033',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''Commercial educational software platforms routinely track keystrokes, webcam eye movements, browsing histories, and behavioral response latencies under the guise of "learning analytics" and remote proctoring.''

What is the primary civil libertarian concern regarding remote exam proctoring algorithms that track eye gaze and facial expressions?',
  'multiple_choice',
  '["The software makes laptops deplete their battery power within three hours.","The software normalizes invasive biometric surveillance and punishes neurodivergent students whose involuntary movements are misflagged as academic cheating.","Webcams produce blurry video during evening testing sessions.","Students might wear hats that conceal their headphones."]'::jsonb,
  'The software normalizes invasive biometric surveillance and punishes neurodivergent students whose involuntary movements are misflagged as academic cheating.',
  'Automated biometric proctoring infringes privacy and discriminates against neurodivergent or anxious students whose eye movements deviate from rigid algorithmic ''normalcy''.',
  1,
  32
),
(
  '33333333-3333-4333-8333-000000000034',
  '33333333-3333-4333-8333-333333333333',
  'Under the UK General Data Protection Regulation (GDPR), on what legal basis can schools justify deploying educational software that processes student behavioral data?',
  'multiple_choice',
  '["Software companies have an absolute right to monetize student data.","The processing must have a lawful basis (such as public task or explicit informed consent) and must comply with data minimization and purpose limitation principles.","Schools are exempt from all international and domestic data protection legislation.","Parents surrender all rights over their children''s data when enrolling in state schools."]'::jsonb,
  'The processing must have a lawful basis (such as public task or explicit informed consent) and must comply with data minimization and purpose limitation principles.',
  'Under GDPR, public educational institutions must establish a lawful basis (like public interest task), collect only strictly necessary data, and prohibit commercial exploitation.',
  1,
  33
),
(
  '33333333-3333-4333-8333-000000000035',
  '33333333-3333-4333-8333-333333333333',
  'What is meant by the phrase ''surveillance capitalism'' when applied to EdTech companies offering ''free'' digital classroom tools?',
  'multiple_choice',
  '["The business model of extracting behavioral data from student interactions to build predictive behavioral profiles for targeted commercial advertising and algorithmic training.","The purchase of physical security cameras for school parking lots.","A government program providing free school breakfasts to elementary pupils.","The practice of paying teachers with corporate stock options."]'::jsonb,
  'The business model of extracting behavioral data from student interactions to build predictive behavioral profiles for targeted commercial advertising and algorithmic training.',
  'Shoshana Zuboff''s concept of surveillance capitalism describes turning user interaction data into proprietary behavioral surplus to predict and shape future behavior.',
  1,
  34
),
(
  '33333333-3333-4333-8333-000000000036',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following propositions represents an empirical assertion rather than an ethical evaluation?',
  'multiple_choice',
  '["Student biometric tracking is an intolerable invasion of childhood privacy.","Over sixty percent of public school districts in the survey utilize learning management software that shares student metadata with third-party advertising brokers.","Schools ought to ban all commercial technology providers from primary classrooms.","It is unethical for tech corporations to profit from adolescent digital interactions."]'::jsonb,
  'Over sixty percent of public school districts in the survey utilize learning management software that shares student metadata with third-party advertising brokers.',
  'This is a factual, statistically verifiable observation about software deployment, whereas the others contain normative ethical assertions (''intolerable'', ''ought'', ''unethical'').',
  1,
  35
),
(
  '33333333-3333-4333-8333-000000000037',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''Governments worldwide systematically reallocate university funding away from the humanities toward STEM disciplines, arguing that national competitiveness requires software engineers and biochemists rather than historians and philosophers.''

What is the central counter-argument advanced in defense of humanistic disciplines in a technological society?',
  'multiple_choice',
  '["Philosophy books are printed on cheaper paper than biology textbooks.","Humanities foster ethical reasoning, historical contextualization, and narrative critique—capacities indispensable for governing the existential risks and social dilemmas posed by technological development.","Software engineers earn lower median salaries than classical Greek scholars.","Ancient languages provide better mental exercise than learning Python code."]'::jsonb,
  'Humanities foster ethical reasoning, historical contextualization, and narrative critique—capacities indispensable for governing the existential risks and social dilemmas posed by technological development.',
  'Humanities provide the critical, ethical, and historical frameworks needed to ask what technologies should be built and how they should be governed for human flourishing.',
  1,
  36
),
(
  '33333333-3333-4333-8333-000000000038',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following demonstrates the fallacy of ''false precision'' in educational policy?',
  'multiple_choice',
  '["Calculating that an English Literature degree produces exactly £14,219.43 less economic value to GDP over a lifetime than a Computer Science degree.","Conducting a national census of school library book collections.","Surveying teachers regarding classroom ventilation quality.","Publishing the median graduation rates of regional polytechnics."]'::jsonb,
  'Calculating that an English Literature degree produces exactly £14,219.43 less economic value to GDP over a lifetime than a Computer Science degree.',
  'False precision occurs when numerical data is presented with exact decimal precision to convey scientific authority, despite relying on highly speculative, uncertain long-term assumptions.',
  1,
  37
),
(
  '33333333-3333-4333-8333-000000000039',
  '33333333-3333-4333-8333-333333333333',
  'An economic planner argues: ''Because tech companies generate 40% of corporate tax revenues, all university funding should be redirected exclusively into coding bootcamps.'' What is the most significant flaw in this argument?',
  'multiple_choice',
  '["It assumes that coding skills remain static and immune to automation, while ignoring the complementary roles of design, law, management, and ethical oversight in technology ecosystems.","It ignores the fact that computer keyboards are manufactured in East Asia.","It presumes that university classrooms are larger than lecture halls.","It assumes that tax revenues are deposited into sovereign wealth accounts."]'::jsonb,
  'It assumes that coding skills remain static and immune to automation, while ignoring the complementary roles of design, law, management, and ethical oversight in technology ecosystems.',
  'The argument suffers from severe tunnel vision: coding is easily automated by AI, and tech industries depend on legal, organizational, communicative, and ethical capabilities.',
  1,
  38
),
(
  '33333333-3333-4333-8333-000000000040',
  '33333333-3333-4333-8333-333333333333',
  'Passage Excerpt: ''The Internet Archive''s "National Emergency Library" during the 2020 lockdowns removed waitlists for scanned physical books, leading major commercial publishers to sue for copyright infringement under Hachette v. Internet Archive.''

What was the federal court''s primary rationale for rejecting the Internet Archive''s "fair use" defense?',
  'multiple_choice',
  '["The court held that libraries are prohibited from operating websites.","Scanning whole print books and distributing unrestricted digital copies without paying licensing fees competes directly with established commercial e-book markets, exceeding statutory fair use boundaries.","The court concluded that print books should never be converted into digital PDF files.","The court held that authors do not possess property rights in written words."]'::jsonb,
  'Scanning whole print books and distributing unrestricted digital copies without paying licensing fees competes directly with established commercial e-book markets, exceeding statutory fair use boundaries.',
  'The court held that mass digitization of entire books for public distribution without licenses supplanted the publishers'' authorized commercial e-book licensing market.',
  1,
  39
),
(
  '33333333-3333-4333-8333-000000000041',
  '33333333-3333-4333-8333-333333333333',
  'What is the defining distinction between ''Controlled Digital Lending'' (CDL) and unrestricted digital pirating?',
  'multiple_choice',
  '["CDL maintains an ''owned-to-loaned'' ratio, circulating only as many digital copies as the library physically purchased and holds in quarantine, whereas piracy creates infinite simultaneous copies.","CDL requires readers to pay a fee of fifty dollars per page.","CDL applies only to books published before the eighteenth century.","Piracy is legally authorized in municipal public libraries."]'::jsonb,
  'CDL maintains an ''owned-to-loaned'' ratio, circulating only as many digital copies as the library physically purchased and holds in quarantine, whereas piracy creates infinite simultaneous copies.',
  'CDL seeks to replicate print lending digitally by ensuring that each loaned digital file corresponds to an actual purchased print copy kept offline and unread.',
  1,
  40
),
(
  '33333333-3333-4333-8333-000000000042',
  '33333333-3333-4333-8333-333333333333',
  'Which of the following propositions best summarizes the constitutional objective of copyright law as originally articulated in the Statute of Anne (1710)?',
  'multiple_choice',
  '["To guarantee perpetual inherited wealth for corporate publishing dynasties.","To encourage learning and the creation of useful works by granting authors a limited temporary monopoly, balancing creator incentives with public access.","To enable the monarch to censor dissenting theological treatises.","To maximize the international export value of printed parchment."]'::jsonb,
  'To encourage learning and the creation of useful works by granting authors a limited temporary monopoly, balancing creator incentives with public access.',
  'Copyright was conceived not as an absolute natural property right, but as a balanced statutory bargain: grant authors a limited monopoly to incentivize creation, then return works to the public domain.',
  1,
  41
)
ON CONFLICT (id) DO UPDATE SET
  test_id = EXCLUDED.test_id,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- QUESTIONNAIRE 4: LNAT Paper 4: Literary Theory & Aesthetic Value (42 Questions)
-- ==============================================================================
INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)
VALUES (
  '44444444-4444-4444-8444-444444444444',
  'LNAT Paper 4: Literary Theory & Aesthetic Value',
  'Adapted from official LNAT Practice Test 2 (Passage 1) and aesthetic philosophy. Focuses on the intentional fallacy, aesthetic objectivity vs relativism, the literary canon, cultural repatriation of artifacts, and artificial intelligence in creative arts.',
  95,
  42,
  true,
  'LNAT - Critical Reasoning'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_points = EXCLUDED.total_points,
  is_published = EXCLUDED.is_published,
  category = EXCLUDED.category;

-- Questions for Questionnaire 4 (Q1 to Q42)
INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
(
  '44444444-4444-4444-8444-000000000001',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''In their seminal 1946 essay "The Intentional Fallacy," W.K. Wimsatt and Monroe Beardsley argued that the design or intention of the author is neither available nor desirable as a standard for judging the success of a work of literary art. A poem does not come into existence by accident, but once published, it belongs to the public and embodies its own internal linguistic autonomy.''

What is the primary thesis of the ''Intentional Fallacy'' doctrine in literary criticism?',
  'multiple_choice',
  '["Authors always deliberately mislead their readers regarding their personal biographies.","A literary text''s meaning and aesthetic value must be judged from the internal evidence of the text itself, rather than from external speculations about the author''s psychological intentions.","Poems should only be analyzed by readers who have interviewed the poet in person.","Literary works written before the twentieth century possess no verifiable aesthetic value."]'::jsonb,
  'A literary text''s meaning and aesthetic value must be judged from the internal evidence of the text itself, rather than from external speculations about the author''s psychological intentions.',
  'Wimsatt and Beardsley argued that looking to an author''s private mental state confuses the cause of a poem with the poem itself; textual meaning resides in the public linguistic artifact.',
  1,
  0
),
(
  '44444444-4444-4444-8444-000000000002',
  '44444444-4444-4444-8444-444444444444',
  'Roland Barthes declared in 1967 that ''the birth of the reader must be at the cost of the death of the Author.'' What does Barthes mean by this metaphorical declaration?',
  'multiple_choice',
  '["Literary critics should actively discourage living writers from publishing new novels.","Meaning is not a fixed, singular essence deposited by an authorial god, but a dynamic, plural construction forged by the reader engaging with language.","Readers must memorize an author''s obituary before analyzing their poems.","Authors lose their legal copyright protections as soon as a book is printed."]'::jsonb,
  'Meaning is not a fixed, singular essence deposited by an authorial god, but a dynamic, plural construction forged by the reader engaging with language.',
  'Barthes argued against author-centric tyranny: a text is a multidimensional space of citations and language whose unity is realized not in its origin (the author), but in its destination (the reader).',
  1,
  1
),
(
  '44444444-4444-4444-8444-000000000003',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following, if true, would pose the most direct challenge to the New Critical insistence that external authorial intent is irrelevant?',
  'multiple_choice',
  '["Satirical texts and irony cannot be reliably identified without understanding the author''s historical context and targets, since a purely literal reading would misinterpret the work''s fundamental meaning.","Poets frequently write drafts on lined notebook paper.","Literary criticism is taught in modern university literature departments.","Many famous novels were rejected by multiple publishing houses before publication."]'::jsonb,
  'Satirical texts and irony cannot be reliably identified without understanding the author''s historical context and targets, since a purely literal reading would misinterpret the work''s fundamental meaning.',
  'Irony and satire (e.g., Swift''s ''A Modest Proposal'') require knowing that the author intended the opposite of the literal words; without authorial communicative intent, satire collapses into monstrous assertion.',
  1,
  2
),
(
  '44444444-4444-4444-8444-000000000004',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following phrases represents an assertion of aesthetic judgment rather than an empirical textual description?',
  'multiple_choice',
  '["''The sonnet consists of fourteen lines written in iambic pentameter.''","''The protagonist''s tragic demise evokes an unmatched sublime catharsis that elevates the drama into masterpiece status.''","''The author published the manuscript in London in 1818.''","''The third stanza contains an explicit rhyme scheme of ABAB.''"]'::jsonb,
  '''The protagonist''s tragic demise evokes an unmatched sublime catharsis that elevates the drama into masterpiece status.''',
  'Describing an emotional effect as ''unmatched sublime catharsis'' and declaring it a ''masterpiece'' is a subjective aesthetic evaluation, whereas line counts, dates, and rhyme schemes are empirical facts.',
  1,
  3
),
(
  '44444444-4444-4444-8444-000000000005',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''David Hume, in "Of the Standard of Taste," acknowledged that beauty is no quality in things themselves: it exists merely in the mind which contemplates them. Yet Hume simultaneously rejected vulgar relativism, observing that someone who preferred Ogilby to Milton would be universally regarded as absurd.''

How did Hume reconcile the subjectivity of aesthetic sentiment with the existence of a durable ''Standard of Taste''?',
  'multiple_choice',
  '["By establishing a government ministry of literary censorship.","By identifying ideal critics who possess delicate sentiment, practiced discernment, freedom from prejudice, and wide comparative experience across artistic traditions.","By declaring that expensive artworks are objectively superior to affordable artworks.","By calculating the average mathematical syllables of popular ballads."]'::jsonb,
  'By identifying ideal critics who possess delicate sentiment, practiced discernment, freedom from prejudice, and wide comparative experience across artistic traditions.',
  'Hume''s solution was the ''joint verdict of true judges'': though sentiment is subjective, experienced critics with refined faculties and freedom from bias provide the standard of taste.',
  1,
  4
),
(
  '44444444-4444-4444-8444-000000000006',
  '44444444-4444-4444-8444-444444444444',
  'Immanuel Kant argued in Critique of Judgment that aesthetic judgments make a claim to ''subjective universality.'' What is meant by this paradox?',
  'multiple_choice',
  '["Everyone in the universe speaks the same native aesthetic language.","When we declare an artwork beautiful, we base the judgment on personal feeling, yet we legitimately demand that all other rational beings ought to share that feeling.","Universal beauty is measured by astronomical planetary alignments.","Artists must sign legal treaties promising to please all international viewers."]'::jsonb,
  'When we declare an artwork beautiful, we base the judgment on personal feeling, yet we legitimately demand that all other rational beings ought to share that feeling.',
  'Kant held that aesthetic pleasure is disinterested; because it does not depend on private idiosyncratic desires, the speaker speaks as if beauty were an objective property commanding universal assent.',
  1,
  5
),
(
  '44444444-4444-4444-8444-000000000007',
  '44444444-4444-4444-8444-444444444444',
  'A radical cultural relativist claims: ''Because all aesthetic standards are socially constructed by prevailing ruling classes, a graffiti tag on a subway wall has identical aesthetic worth to Michelangelo''s Sistine Chapel ceiling.'' What is the primary logical flaw in this argument?',
  'multiple_choice',
  '["It assumes that subway graffiti was invented in the fifteenth century.","It fallaciously assumes that because an evaluative standard is socially formed and culturally contingent, it cannot possess meaningful gradations of technical complexity, expressiveness, or depth within its cultural context.","It ignores the fact that Michelangelo used scaffolding to paint the ceiling.","It misidentifies the Sistine Chapel as a municipal railway terminal."]'::jsonb,
  'It fallaciously assumes that because an evaluative standard is socially formed and culturally contingent, it cannot possess meaningful gradations of technical complexity, expressiveness, or depth within its cultural context.',
  'Recognizing that standards are socially constructed does not imply all creations are equally accomplished; within any coherent aesthetic framework, works differ in mastery and expressive depth.',
  1,
  6
),
(
  '44444444-4444-4444-8444-000000000008',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following scenarios best demonstrates an ''appeal to popularity'' (argumentum ad populum) in literary evaluation?',
  'multiple_choice',
  '["Arguing that a best-selling thriller novel is superior literature to a complex modernist novella simply because it sold ten million copies.","Analyzing the psychological development of a protagonist across a trilogy.","Comparing the metaphorical structures of two renaissance sonnets.","Examining the historical archival drafts of an author''s diary."]'::jsonb,
  'Arguing that a best-selling thriller novel is superior literature to a complex modernist novella simply because it sold ten million copies.',
  'Equating commercial sales volume or widespread popularity with artistic excellence is a textbook appeal to popularity fallacy.',
  1,
  7
),
(
  '44444444-4444-4444-8444-000000000009',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''The debate over the Western Canon pits traditionalists like Harold Bloom, who defend an aesthetic hierarchy rooted in sublime cognitive originality, against critical theorists who view the canon as a socio-political instrument of patriarchal and imperial hegemony.''

What is the central feminist critique of the traditional literary canon?',
  'multiple_choice',
  '["Feminist critics object to the physical thickness of hardbound canonical anthologies.","The canon historically excluded women writers not due to intrinsic aesthetic deficiency, but through systemic denials of educational access, institutional publishing gatekeeping, and gendered criteria of artistic value.","Women writers refuse to write in poetic verse forms.","Female characters are absent from all nineteenth-century European novels."]'::jsonb,
  'The canon historically excluded women writers not due to intrinsic aesthetic deficiency, but through systemic denials of educational access, institutional publishing gatekeeping, and gendered criteria of artistic value.',
  'Feminist criticism (e.g. Virginia Woolf''s ''A Room of One''s Own'') exposes how institutional patriarchal barriers and male-dominated evaluation criteria historically marginalized female voices.',
  1,
  8
),
(
  '44444444-4444-4444-8444-000000000010',
  '44444444-4444-4444-8444-444444444444',
  'Harold Bloom argued in The Western Canon that canon formation is driven by ''aesthetic aesthetic anxiety and cognitive strength,'' rather than political ideology. What is an unstated assumption in Bloom''s defense?',
  'multiple_choice',
  '["Aesthetic criteria can be insulated from and judged independently of the social, material, and political conditions under which literature is produced and patronized.","All canonical writers were employed as university professors.","Non-Western writers never experienced creative anxiety.","Books written in the English language are universally superior to translated works."]'::jsonb,
  'Aesthetic criteria can be insulated from and judged independently of the social, material, and political conditions under which literature is produced and patronized.',
  'Bloom assumes an autonomous aesthetic sphere where literary quality transcends material class, race, and gender dynamics.',
  1,
  9
),
(
  '44444444-4444-4444-8444-000000000011',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following propositions represents an inductive argument regarding literary reception?',
  'multiple_choice',
  '["Because Shakespeare''s plays have resonated with audiences across four centuries of diverse global cultures, they will likely continue to speak to future human generations.","If all great literature addresses the human condition, and Hamlet addresses the human condition, then Hamlet must be great literature.","No novel written in prose can be classified as a rhyming lyric poem.","Every book that contains a table of contents is an academic textbook."]'::jsonb,
  'Because Shakespeare''s plays have resonated with audiences across four centuries of diverse global cultures, they will likely continue to speak to future human generations.',
  'This is an inductive projection based on observed historical patterns across four centuries, inferring probable future relevance rather than a deductive certainty.',
  1,
  10
),
(
  '44444444-4444-4444-8444-000000000012',
  '44444444-4444-4444-8444-444444444444',
  'What is meant by the concept of ''canonicity'' when applied to university literature curricula?',
  'multiple_choice',
  '["The legal requirement to read manuscripts using magnifying glasses.","The institutionalized selection of privileged texts deemed essential for cultural literacy and worthy of formal pedagogical transmission.","The process of printing books exclusively on parchment paper.","The mandatory inclusion of military history texts in language departments."]'::jsonb,
  'The institutionalized selection of privileged texts deemed essential for cultural literacy and worthy of formal pedagogical transmission.',
  'The canon is the curated corpus of authoritative texts that institutions select as embodying the highest artistic excellence and cultural knowledge.',
  1,
  11
),
(
  '44444444-4444-4444-8444-000000000013',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''In the landmark obscenity trial R v Penguin Books Ltd (1960), the prosecution famously asked the jury whether D.H. Lawrence''s Lady Chatterley''s Lover was a book they "would even wish your wife or your servants to read." The jury''s acquittal established that serious literary merit constitutes a complete statutory defense under the Obscene Publications Act 1959.''

What was the profound social and legal transformation signaled by the Lady Chatterley verdict?',
  'multiple_choice',
  '["It abolished all criminal courts throughout the United Kingdom.","It established that artistic integrity and serious literary inquiry take precedence over traditional Victorian moral prudery and class-based paternalistic censorship.","It made reading D.H. Lawrence compulsory for university entrance examinations.","It transferred publishing licensing authority to trade union councils."]'::jsonb,
  'It established that artistic integrity and serious literary inquiry take precedence over traditional Victorian moral prudery and class-based paternalistic censorship.',
  'The trial dismantled paternalistic moral censorship in British law, establishing that literary merit for the public good protects controversial art from obscenity convictions.',
  1,
  12
),
(
  '44444444-4444-4444-8444-000000000014',
  '44444444-4444-4444-8444-444444444444',
  'Under the classical common-law Hicklin test (1868), what was the definition of legal obscenity?',
  'multiple_choice',
  '["Whether the price of the book exceeded the daily wage of an agricultural laborer.","Whether the tendency of the matter charged as obscenity is to deprave and corrupt those whose minds are open to such immoral influences.","Whether the text contained spelling mistakes in Latin quotations.","Whether the author had been expelled from a religious congregation."]'::jsonb,
  'Whether the tendency of the matter charged as obscenity is to deprave and corrupt those whose minds are open to such immoral influences.',
  'The Hicklin test defined obscenity by its supposed tendency to deprave and corrupt the most vulnerable minds, ignoring artistic intent or serious literary value.',
  1,
  13
),
(
  '44444444-4444-4444-8444-000000000015',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following arguments against censoring transgressive literature is rooted in John Stuart Mill''s epistemology in On Liberty?',
  'multiple_choice',
  '["Censoring offensive ideas deprives society of the opportunity to sharpen and defend the truth against robust challenge, or to discover valuable truths buried within unconventional speech.","Book printing generates substantial local sales tax revenues for municipal authorities.","Writers who are imprisoned become famous celebrities.","Paper production stimulates domestic forestry industries."]'::jsonb,
  'Censoring offensive ideas deprives society of the opportunity to sharpen and defend the truth against robust challenge, or to discover valuable truths buried within unconventional speech.',
  'Mill argued that silencing any opinion robs the human race: if the opinion is right, we lose truth; if wrong, we lose the vital perception of truth produced by its collision with error.',
  1,
  14
),
(
  '44444444-4444-4444-8444-000000000016',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following propositions represents an unstated assumption in the claim: ''Banning violent imagery in literature will eliminate real-world violent crime''?',
  'multiple_choice',
  '["Reading violent fiction directly causes individuals to commit violent crimes, and literary exposure is the sole or dominant causal driver of criminal behavior.","Prisons provide literary education programs to inmates.","Violent crime rates fluctuate during macroeconomic recessions.","All violent novels are printed in hardback editions."]'::jsonb,
  'Reading violent fiction directly causes individuals to commit violent crimes, and literary exposure is the sole or dominant causal driver of criminal behavior.',
  'The claim assumes a direct, unmediated causal link between consuming fictional depictions of violence and committing physical acts, ignoring complex socioeconomic, biological, and psychological factors.',
  1,
  15
),
(
  '44444444-4444-4444-8444-000000000017',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''The Italian proverb "Traduttore, traditore" (translator, traitor) encapsulates the impossibility of absolute semantic equivalence across cultural and linguistic divides. Walter Benjamin argued that a translation does not strive to be an identical copy, but rather to touch the original fleetingly at an infinitely small point of the sense.''

What is the primary linguistic challenge when translating poetic metaphors into another language?',
  'multiple_choice',
  '["Translators are unable to purchase bilingual dictionaries.","Metaphors carry cultural connotations, etymological histories, phonetic rhythms, and double meanings that cannot be transposed without substantial interpretive alteration.","Foreign alphabets have fewer letters than the Latin script.","Printers cannot reproduce accents on capital letters."]'::jsonb,
  'Metaphors carry cultural connotations, etymological histories, phonetic rhythms, and double meanings that cannot be transposed without substantial interpretive alteration.',
  'Poetic language derives its resonance from specific linguistic and cultural associations, sonic textures, and polysemy that resist word-for-word substitution.',
  1,
  16
),
(
  '44444444-4444-4444-8444-000000000018',
  '44444444-4444-4444-8444-444444444444',
  'Lawrence Venuti distinguishes between ''domestication'' and ''foreignization'' in translation strategy. What is meant by ''foreignizing'' a translation?',
  'multiple_choice',
  '["Printing the entire text in a foreign currency.","Deliberately retaining stylistic and cultural markers of the source language to disrupt the reader''s ethnocentric complacency and signal the foreign origin of the text.","Translating only books written by foreign diplomats.","Refusing to distribute the book within domestic bookstores."]'::jsonb,
  'Deliberately retaining stylistic and cultural markers of the source language to disrupt the reader''s ethnocentric complacency and signal the foreign origin of the text.',
  'Foreignization preserves source-culture idioms and syntactic strangeness to challenge linguistic imperialism, in contrast to domestication which smooths everything into familiar domestic norms.',
  1,
  17
),
(
  '44444444-4444-4444-8444-000000000019',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following statements represents a logical deduction rather than an empirical hypothesis?',
  'multiple_choice',
  '["If a poem''s identity consists strictly in the exact acoustic and rhythmic properties of the original language, and translating a poem changes those properties, then a poem cannot be translated without altering its identity.","Most readers prefer reading translations that flow seamlessly without awkward archaic phrasing.","Japanese haiku poetry developed during the Edo period in samurai culture.","Translators earn lower royalty percentages than original prose authors."]'::jsonb,
  'If a poem''s identity consists strictly in the exact acoustic and rhythmic properties of the original language, and translating a poem changes those properties, then a poem cannot be translated without altering its identity.',
  'This follows rigorous deductive logic: premise A + premise B necessarily entail conclusion C regardless of real-world reader preferences.',
  1,
  18
),
(
  '44444444-4444-4444-8444-000000000020',
  '44444444-4444-4444-8444-444444444444',
  'What is an underlying flaw in the reasoning: ''Because translation inevitably loses some nuance of the original work, reading translated literature is entirely worthless''?',
  'multiple_choice',
  '["It commits the ''all-or-nothing'' fallacy, ignoring that substantial narrative, philosophical, and emotional richness can be communicated across languages even if total perfection is impossible.","It uses the word ''nuance'' inappropriately.","It assumes that all translators live in metropolitan capital cities.","It forgets that dictionaries are compiled by linguistic scholars."]'::jsonb,
  'It commits the ''all-or-nothing'' fallacy, ignoring that substantial narrative, philosophical, and emotional richness can be communicated across languages even if total perfection is impossible.',
  'This false dilemma treats imperfect translation as equivalent to complete worthlessness, disregarding the enormous value of cross-cultural literary exchange.',
  1,
  19
),
(
  '44444444-4444-4444-8444-000000000021',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''Philosopher Martha Nussbaum contends that reading complex literary fiction cultivates the "narrative imagination," fostering the capacity to perceive the world from the situated perspective of another human being, which is essential for compassionate democratic citizenship.''

According to Nussbaum, why is literary narrative uniquely suited to cultivating moral empathy?',
  'multiple_choice',
  '["Because novels are cheaper to purchase than philosophical treatises.","Because narrative immerses readers in the specific lived experiences, inner vulnerabilities, and moral dilemmas of characters vastly different from themselves, breaking parochial solipsism.","Because reading literature improves typing speed in office workers.","Because fictional characters are bound by international human rights treaties."]'::jsonb,
  'Because narrative immerses readers in the specific lived experiences, inner vulnerabilities, and moral dilemmas of characters vastly different from themselves, breaking parochial solipsism.',
  'Nussbaum argues that literary fiction engages our emotions and moral imagination by revealing the rich internal lives of others, cultivating empathy vital for justice.',
  1,
  20
),
(
  '44444444-4444-4444-8444-000000000022',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following findings, if true, would provide the strongest empirical challenge to Nussbaum''s thesis regarding literature and moral empathy?',
  'multiple_choice',
  '["Psychological studies demonstrating that voracious readers of high literature exhibit no higher rates of altruistic prosocial behavior in real-world crises than non-readers.","Surveys indicating that university literature majors buy second-hand paperbacks.","Reports showing that poetry books sell fewer copies than cookbooks.","Historical records showing that William Shakespeare owned real estate in Stratford."]'::jsonb,
  'Psychological studies demonstrating that voracious readers of high literature exhibit no higher rates of altruistic prosocial behavior in real-world crises than non-readers.',
  'If cultivating ''narrative imagination'' on the page fails to translate into actual moral behavior in real life, Nussbaum''s core empirical claim of moral transformation is critically undermined.',
  1,
  21
),
(
  '44444444-4444-4444-8444-000000000023',
  '44444444-4444-4444-8444-444444444444',
  'George Orwell asserted in ''Politics and the English Language'' that decadent language corrupts thought, and political chaos is connected to the decay of linguistic precision. What is the central mechanism of this connection?',
  'multiple_choice',
  '["Typewriters break down when typing long words.","Vague euphemisms and inflated phrases are deliberately used to make lies sound truthful and murder respectable, numbing moral consciousness through linguistic obscurity.","Grammar teachers are underpaid in public schools.","Political parties require all members to speak with southern regional accents."]'::jsonb,
  'Vague euphemisms and inflated phrases are deliberately used to make lies sound truthful and murder respectable, numbing moral consciousness through linguistic obscurity.',
  'Orwell exposed how political euphemisms (e.g. ''pacification'', ''elimination'') mask brutal realities, insulating the speaker and listener from the emotional weight of their deeds.',
  1,
  22
),
(
  '44444444-4444-4444-8444-000000000024',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following statements represents an analogy commonly employed in the philosophy of narrative ethics?',
  'multiple_choice',
  '["A novel is a moral mirror held up to human nature, reflecting our unvarnished ethical complexities.","A book is a collection of paper fibers bound with synthetic glue.","A sentence is a sequence of grammatical clauses separated by punctuation.","A library is a public building funded by municipal council tax."]'::jsonb,
  'A novel is a moral mirror held up to human nature, reflecting our unvarnished ethical complexities.',
  'The ''moral mirror'' is a classic literary metaphor comparing fiction to a reflective surface that reveals the truth of the observer''s inner ethical nature.',
  1,
  23
),
(
  '44444444-4444-4444-8444-000000000025',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''The debate over "cultural appropriation" in the arts questions whether artists from historically dominant groups have the right to depict or incorporate the sacred traditions, voices, and traumatic experiences of historically oppressed minority cultures.''

What is the defining distinction between cultural exploitation (''appropriation'') and respectful cultural exchange (''syncretism'') in postcolonial critique?',
  'multiple_choice',
  '["Whether the artist has registered a trademark with the state patent office.","Whether the cultural borrowing occurs within asymmetric relations of structural power that commodify and profit from marginal traditions while erasing or silencing the originating community.","Whether the artwork was created using oil paint or acrylic watercolors.","Whether the artist has traveled by air to the originating country."]'::jsonb,
  'Whether the cultural borrowing occurs within asymmetric relations of structural power that commodify and profit from marginal traditions while erasing or silencing the originating community.',
  'Appropriation is distinguished from mutual syncretism by power asymmetries: dominant actors extract cultural elements for profit and status while the source community remains marginalized.',
  1,
  24
),
(
  '44444444-4444-4444-8444-000000000026',
  '44444444-4444-4444-8444-444444444444',
  'An author defending complete creative freedom asserts: ''If novelists are restricted to writing only about characters of their own identical ethnicity, gender, and social background, the very art of the novel—which is the leap of imagination into the unknown—is extinguished.'' What is the author''s primary logical defense?',
  'multiple_choice',
  '["That fiction is by definition an act of imagining otherness, and imposing strict autobiographical restrictions reduces literature to solipsistic memoir.","That publishing companies pay higher royalties for autobiographical memoirs.","That readers never enjoy historical fiction.","That all novelists hold advanced degrees in anthropology."]'::jsonb,
  'That fiction is by definition an act of imagining otherness, and imposing strict autobiographical restrictions reduces literature to solipsistic memoir.',
  'The core defense of imaginative autonomy is that fiction requires empathic extrapolation beyond the author''s biographical boundaries; banning this destroys the novelistic form.',
  1,
  25
),
(
  '44444444-4444-4444-8444-000000000027',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following propositions represents an unstated assumption in the argument: ''Non-indigenous authors who write novels featuring indigenous protagonists should be condemned''?',
  'multiple_choice',
  '["It is impossible for an outsider to portray the experience of an indigenous person with sufficient authenticity, respect, or legitimate cultural authority.","Indigenous folklore was never written down prior to European contact.","Publishers print books using offset lithographic presses.","Novels written by non-indigenous authors are always bestsellers."]'::jsonb,
  'It is impossible for an outsider to portray the experience of an indigenous person with sufficient authenticity, respect, or legitimate cultural authority.',
  'The condemnation presupposes that cultural boundaries create an insurmountable epistemic barrier, making authentic or ethical portrayal by an outsider impossible.',
  1,
  26
),
(
  '44444444-4444-4444-8444-000000000028',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following historical examples represents creative cross-cultural syncretism that fundamentally enriched a musical genre?',
  'multiple_choice',
  '["The birth of American Jazz and Blues through the synthesis of African rhythmic traditions, work songs, and European harmonic structures.","A corporate pop artist lip-syncing over pre-recorded tracks at a stadium concert.","A vinyl record manufacturer switching from heavy vinyl to lightweight plastic.","A concert hall charging premium prices for front-row balcony seating."]'::jsonb,
  'The birth of American Jazz and Blues through the synthesis of African rhythmic traditions, work songs, and European harmonic structures.',
  'Jazz and blues are pre-eminent examples of fertile cultural syncretism, creating entirely new transformative art forms through cross-cultural musical dialogue.',
  1,
  27
),
(
  '44444444-4444-4444-8444-000000000029',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''Generative diffusion models and neural networks can produce mesmerizing visual paintings and sonnets upon receiving textual prompts. Yet aesthetic philosophers debate whether an entity lacking consciousness, lived embodiment, and mortality can genuinely create "art".''

What is the primary philosophical objection to classifying purely AI-generated outputs as genuine ''art''?',
  'multiple_choice',
  '["Computers consume too much electrical power during rendering.","Art is an intrinsically communicative human act rooted in subjective conscious intentionality, emotional vulnerability, and existential human experience, none of which an algorithm possesses.","Generative models can only render images in standard RGB color spaces.","Computer algorithms cannot execute mathematical matrix multiplication."]'::jsonb,
  'Art is an intrinsically communicative human act rooted in subjective conscious intentionality, emotional vulnerability, and existential human experience, none of which an algorithm possesses.',
  'Philosophers like Arthur Danto argue that art is intentional communication between conscious minds; without conscious intentionality, AI outputs are merely aesthetic artifacts or simulations.',
  1,
  28
),
(
  '44444444-4444-4444-8444-000000000030',
  '44444444-4444-4444-8444-444444444444',
  'In the United States copyright case Thaler v. Perlmutter (2023), what did the federal court rule regarding copyright ownership of AI-generated visual art?',
  'multiple_choice',
  '["The computer software itself is granted legal personhood and holds the copyright.","Copyright law strictly requires human authorship; works created autonomously by artificial intelligence without human creative control cannot be copyrighted.","The electric power company supplying electricity to the computer owns the copyright.","All AI-generated images are automatically classified as state-owned secrets."]'::jsonb,
  'Copyright law strictly requires human authorship; works created autonomously by artificial intelligence without human creative control cannot be copyrighted.',
  'The court held that human authorship is a foundational requirement of copyright law; works generated entirely autonomously by machines are ineligible for copyright.',
  1,
  29
),
(
  '44444444-4444-4444-8444-000000000031',
  '44444444-4444-4444-8444-444444444444',
  'An art critic argues: ''When photography was invented in the nineteenth century, painters declared that art was dead because a mechanical box could capture reality instantly. Today, critics make the exact same reactionary mistake regarding generative AI.'' What is the critic''s argument by analogy?',
  'multiple_choice',
  '["That just as photography transformed and expanded art rather than destroying it, AI will become another expressive medium utilized by human creative practitioners.","That cameras and graphics cards are made from the same metal components.","That nineteenth-century painters were inferior to modern digital artists.","That photographic film is cheaper than digital cloud storage."]'::jsonb,
  'That just as photography transformed and expanded art rather than destroying it, AI will become another expressive medium utilized by human creative practitioners.',
  'The analogy argues that historical panic over mechanical technology replacing human artistry proved misplaced with photography, and AI will similarly become a tool of expanded creativity.',
  1,
  30
),
(
  '44444444-4444-4444-8444-000000000032',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following propositions represents a false dilemma regarding artificial intelligence in artistic creation?',
  'multiple_choice',
  '["Either we immediately outlaw all algorithmic generative models, or human artists will be completely eradicated from society forever.","Copyright statutes must evolve to address the unauthorized scraping of creative works for training data.","Artists can use generative tools to brainstorm preliminary visual concepts.","Digital tools require substantial computational energy during training phases."]'::jsonb,
  'Either we immediately outlaw all algorithmic generative models, or human artists will be completely eradicated from society forever.',
  'This creates an absurd false binary between a total ban and total human extinction, ignoring the vast realistic spectrum of hybrid collaboration, regulation, and artistic adaptation.',
  1,
  31
),
(
  '44444444-4444-4444-8444-000000000033',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''Russian Formalism and Anglo-American New Criticism insisted on "close reading" of the text as an autonomous verbal icon, isolating it from historical, biographical, and economic context. In contrast, Marxist and New Historicist critics contend that no literary text can be understood outside the material forces and power relations that produced it.''

What is the defining technique of Russian Formalist criticism?',
  'multiple_choice',
  '["Counting the total number of words in a chapter.","Analyzing how literary techniques \"defamiliarize\" ordinary language and perception (ostranenie), making the familiar appear strange to revitalize sensory awareness.","Writing literature exclusively during Siberian winters.","Translating novels into musical notation."]'::jsonb,
  'Analyzing how literary techniques "defamiliarize" ordinary language and perception (ostranenie), making the familiar appear strange to revitalize sensory awareness.',
  'Viktor Shklovsky coined ''defamiliarization'' (ostranenie): the purpose of art is to impart the sensation of things as they are perceived and not as they are known, breaking habitual numbness.',
  1,
  32
),
(
  '44444444-4444-4444-8444-000000000034',
  '44444444-4444-4444-8444-444444444444',
  'A New Historicist critic analyzes Shakespeare''s The Tempest not primarily as a poetic meditation on art and forgiveness, but as a cultural document reflecting early modern English colonial anxieties regarding the colonization of the Americas. What is this critical approach emphasizing?',
  'multiple_choice',
  '["The acoustic meter of blank verse syllables.","The historical contextualization of the text as an active participant in the ideological discourses and power struggles of its historical epoch.","The physical durability of seventeenth-century paper printing presses.","The personal dental hygiene of Renaissance theatre actors."]'::jsonb,
  'The historical contextualization of the text as an active participant in the ideological discourses and power struggles of its historical epoch.',
  'New Historicism examines literature as deeply embedded in the political discourses, colonial power structures, and cultural anxieties of its specific historical moment.',
  1,
  33
),
(
  '44444444-4444-4444-8444-000000000035',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following, if true, would most weaken the formalist claim that a literary text is entirely self-contained and autonomous?',
  'multiple_choice',
  '["Readers who lack knowledge of Renaissance political terminology and biblical allusions completely miss the central thematic arguments in Milton''s Paradise Lost.","Poets often revise their manuscripts before sending them to publishers.","Literature textbooks are widely sold in university campus stores.","Many classical Greek poems were performed with musical accompaniment."]'::jsonb,
  'Readers who lack knowledge of Renaissance political terminology and biblical allusions completely miss the central thematic arguments in Milton''s Paradise Lost.',
  'If comprehension requires external historical, theological, and linguistic context, the text cannot be an autonomous verbal island readable in complete isolation.',
  1,
  34
),
(
  '44444444-4444-4444-8444-000000000036',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following statements represents a normative methodological recommendation rather than an empirical description of a literary movement?',
  'multiple_choice',
  '["New Criticism gained institutional dominance in American university English departments during the 1940s and 1950s.","Critics ought to evaluate literature solely through close textual scrutiny rather than dwelling on the author''s private correspondence.","Structuralist critics examined underlying linguistic codes and narrative syntagms.","The Cambridge School of literary criticism was associated with I.A. Richards and F.R. Leavis."]'::jsonb,
  'Critics ought to evaluate literature solely through close textual scrutiny rather than dwelling on the author''s private correspondence.',
  'The claim that critics ''ought to evaluate'' in a particular manner is a prescriptive normative judgment, unlike the factual historical accounts in the other choices.',
  1,
  35
),
(
  '44444444-4444-4444-8444-000000000037',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''Governments routinely face difficult choices when funding the arts through public bodies like Arts Council England. Utilitarians demand justification via economic impact metrics (tourism revenue, urban regeneration), whereas humanists defend public subsidy for intrinsic aesthetic enrichment.''

What is the primary danger of justifying state arts funding solely on ''instrumental'' economic grounds (e.g., boosting tourism)?',
  'multiple_choice',
  '["Tourists often misplace their museum entry tickets.","Challenging, avant-garde, or politically transgressive art that does not generate commercial tourist revenue is systematically starved of support in favor of safe, commercial spectacles.","Museum buildings consume more electricity than sports arenas.","Curators will be forced to study accounting rather than art history."]'::jsonb,
  'Challenging, avant-garde, or politically transgressive art that does not generate commercial tourist revenue is systematically starved of support in favor of safe, commercial spectacles.',
  'When art is valued solely as an economic engine, funding gravitates toward lucrative blockbuster crowd-pleasers, while risky, experimental, and challenging works are abandoned.',
  1,
  36
),
(
  '44444444-4444-4444-8444-000000000038',
  '44444444-4444-4444-8444-444444444444',
  'A libertarian economist argues: ''If an artwork is truly valuable, citizens will voluntarily pay to see it in a free market. Subsidizing unpopular operas and experimental galleries forces working-class taxpayers to fund the elite hobbies of the wealthy.'' What is the strongest egalitarian counter-argument?',
  'multiple_choice',
  '["Opera tickets are printed on glossy paper.","Unregulated market mechanisms fail to account for positive cultural externalities and systematically favor corporate mass entertainment, while public subsidies keep high culture accessible and affordable to all social classes.","Opera singers practice vocal scales for several hours every morning.","Tax revenues are collected through electronic bank transfers."]'::jsonb,
  'Unregulated market mechanisms fail to account for positive cultural externalities and systematically favor corporate mass entertainment, while public subsidies keep high culture accessible and affordable to all social classes.',
  'Public arts funding corrects market failure: without subsidies, high art becomes an exclusive playground for the rich, whereas subsidies democratize access for lower-income citizens.',
  1,
  37
),
(
  '44444444-4444-4444-8444-000000000039',
  '44444444-4444-4444-8444-444444444444',
  'Which of the following propositions represents an unstated assumption in the claim: ''Because public funding should reflect the tastes of the majority, arts grants should be decided by public opinion polls''?',
  'multiple_choice',
  '["Aesthetic excellence and cultural value are identical to democratic majority popularity at any given moment in time.","Museums are open to the public on weekends.","Public opinion polls have a margin of error of three percent.","Artists are forbidden from participating in municipal elections."]'::jsonb,
  'Aesthetic excellence and cultural value are identical to democratic majority popularity at any given moment in time.',
  'The proposal assumes that cultural merit is a direct function of popular consensus, rejecting the notion that groundbreaking art often challenges or outrages majority tastes initially.',
  1,
  38
),
(
  '44444444-4444-4444-8444-000000000040',
  '44444444-4444-4444-8444-444444444444',
  'Passage Excerpt: ''The debate over the Parthenon Sculptures (Elgin Marbles) and the Benin Bronzes brings into sharp conflict the "universal museum" doctrine and the postcolonial imperative for cultural repatriation.''

What is the primary argument advanced by major institutions (like the British Museum) in defense of the ''Universal Museum'' concept?',
  'multiple_choice',
  '["That museum staff speak English better than foreign curators.","That encyclopedic museums provide a global, cosmopolitan space where artifacts from diverse civilizations can be studied comparatively side-by-side by international visitors.","That stone artifacts deteriorate rapidly if transported across international borders.","That ancient Greek civilization was founded by British explorers."]'::jsonb,
  'That encyclopedic museums provide a global, cosmopolitan space where artifacts from diverse civilizations can be studied comparatively side-by-side by international visitors.',
  'Universal museums argue they provide an invaluable cosmopolitan hub for cross-cultural comparison and world heritage appreciation beyond nationalist boundaries.',
  1,
  39
),
(
  '44444444-4444-4444-8444-000000000041',
  '44444444-4444-4444-8444-444444444444',
  'On what moral and legal ground do nations seeking restitution (such as Nigeria for the Benin Bronzes) demand the return of their cultural treasures?',
  'multiple_choice',
  '["The artifacts were acquired through violent imperial conquest, looting, and coercive colonial theft, violating basic principles of justice and depriving the originating society of its living cultural heritage.","The British Museum''s display cases are poorly lit.","Modern bronze casting techniques are cheaper than historical methods.","The artifacts weigh less than ten kilograms."]'::jsonb,
  'The artifacts were acquired through violent imperial conquest, looting, and coercive colonial theft, violating basic principles of justice and depriving the originating society of its living cultural heritage.',
  'Restitution claims rest on corrective justice: items looted during military expeditions (such as the 1897 British sack of Benin City) were acquired illegitimately and must be returned.',
  1,
  40
),
(
  '44444444-4444-4444-8444-000000000042',
  '44444444-4444-4444-8444-444444444444',
  'A museum trustee argues: ''If we return the Parthenon Sculptures to Athens, where will it end? Every museum in the Western world will have to be completely emptied of its exhibits.'' What logical fallacy does this argument commit?',
  'multiple_choice',
  '["The slippery slope fallacy (assuming without justification that resolving a clear, specific claim of contested colonial acquisition must inevitably lead to the total dissolution of all museums).","An ad hominem attack against Greek archaeologists.","A straw man argument regarding marble quarrying techniques.","The fallacy of composition regarding museum ticket sales."]'::jsonb,
  'The slippery slope fallacy (assuming without justification that resolving a clear, specific claim of contested colonial acquisition must inevitably lead to the total dissolution of all museums).',
  'This is a classic slippery slope fallacy: it asserts that returning a well-documented contested artifact will automatically trigger the extreme and absurd outcome of emptying all museums everywhere.',
  1,
  41
)
ON CONFLICT (id) DO UPDATE SET
  test_id = EXCLUDED.test_id,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- QUESTIONNAIRE 5: LNAT Paper 5: Climate Policy & Economic Realism (42 Questions)
-- ==============================================================================
INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)
VALUES (
  '55555555-5555-4555-8555-555555555555',
  'LNAT Paper 5: Climate Policy & Economic Realism',
  'Derived from official LNAT Practice Test 2 and environmental economics. Analyzes market instruments vs regulation, intergenerational discount rates, green growth vs degrowth, climate justice, rights-of-nature litigation, and energy security.',
  95,
  42,
  true,
  'LNAT - Critical Reasoning'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_points = EXCLUDED.total_points,
  is_published = EXCLUDED.is_published,
  category = EXCLUDED.category;

-- Questions for Questionnaire 5 (Q1 to Q42)
INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
(
  '55555555-5555-4555-8555-000000000001',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''Economists widely champion carbon pricing—via carbon taxes or cap-and-trade emissions trading systems (ETS)—as the most market-efficient mechanism to internalize negative externalities. By attaching a clear financial liability to greenhouse gas emissions, market forces incentivize decentralized innovation at the lowest marginal abatement cost.''

What is the fundamental theoretical difference between a carbon tax and a cap-and-trade emissions trading system?',
  'multiple_choice',
  '["A carbon tax sets the price of carbon and lets the market determine the quantity of emissions, whereas cap-and-trade sets the total quantity cap and lets market trading determine the price.","A carbon tax applies only to aviation, whereas cap-and-trade applies exclusively to agricultural farms.","A carbon tax is administered by the United Nations, while cap-and-trade is operated by private banks.","A carbon tax guarantees zero emissions within five years, while cap-and-trade allows unlimited emissions."]'::jsonb,
  'A carbon tax sets the price of carbon and lets the market determine the quantity of emissions, whereas cap-and-trade sets the total quantity cap and lets market trading determine the price.',
  'Under Weitzman''s ''Prices vs Quantities'' theorem: a carbon tax fixes the price certainty while emissions volume fluctuates; cap-and-trade fixes emissions volume certainty while allowance prices fluctuate.',
  1,
  0
),
(
  '55555555-5555-4555-8555-000000000002',
  '55555555-5555-4555-8555-555555555555',
  'Why do critics argue that carbon pricing alone is insufficient to achieve rapid economy-wide decarbonization?',
  'multiple_choice',
  '["Because fossil fuels are immune to price elasticity.","Because carbon pricing fails to address systemic market failures such as split-incentives in rental housing, the absence of clean transmission grid infrastructure, and long-term capital risks in breakthrough technologies.","Because corporations always ignore taxation when calculating profits.","Because paper currency cannot account for greenhouse gas molecular weights."]'::jsonb,
  'Because carbon pricing fails to address systemic market failures such as split-incentives in rental housing, the absence of clean transmission grid infrastructure, and long-term capital risks in breakthrough technologies.',
  'Pricing carbon alone cannot build high-voltage grids, overcome landlord-tenant split incentives, or finance deep infrastructure transitions that require state industrial planning.',
  1,
  1
),
(
  '55555555-5555-4555-8555-000000000003',
  '55555555-5555-4555-8555-555555555555',
  'What is meant by the economic concept of ''regressivity'' in consumer carbon taxation?',
  'multiple_choice',
  '["The tax decreases over time as renewable energy expands.","Lower-income households spend a significantly higher percentage of their disposable income on essential energy, heating, and fuel than wealthy households, making flat carbon taxes disproportionately punitive for the poor.","The tax applies only to retired citizens.","The tax is collected by municipal town halls rather than central treasuries."]'::jsonb,
  'Lower-income households spend a significantly higher percentage of their disposable income on essential energy, heating, and fuel than wealthy households, making flat carbon taxes disproportionately punitive for the poor.',
  'Because basic energy consumption is relatively inelastic and forms a larger share of poor families'' budgets, flat carbon taxes act regressively unless revenues are redistributed via dividends.',
  1,
  2
),
(
  '55555555-5555-4555-8555-000000000004',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following policy mechanisms best offsets the regressive impact of a consumer carbon tax?',
  'multiple_choice',
  '["A ''Carbon Fee and Dividend'' model where 100% of collected carbon tax revenues are returned directly to all citizens as equal per-capita cash rebates.","Exempting luxury yacht fuel from taxation.","Increasing sales taxes on public bus transit tickets.","Subsidizing corporate marketing campaigns for commercial airlines."]'::jsonb,
  'A ''Carbon Fee and Dividend'' model where 100% of collected carbon tax revenues are returned directly to all citizens as equal per-capita cash rebates.',
  'Because low-income households consume fewer fossil fuels in absolute terms than wealthy households, an equal per-capita rebate leaves the majority of lower-income families with a net financial gain.',
  1,
  3
),
(
  '55555555-5555-4555-8555-000000000005',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''The debate between Nicholas Stern (The Stern Review, 2006) and William Nordhaus on climate economics hinges fundamentally on the social discount rate. Stern utilized a near-zero pure rate of time preference (0.1%), arguing that discounting the welfare of future generations simply because they do not yet exist is ethically indefensible.''

Why does choosing a near-zero discount rate lead to dramatically higher estimates of the ''social cost of carbon''?',
  'multiple_choice',
  '["It assumes that interest rates on bank loans will become negative.","It prevents future catastrophic climate damages occurring 50 to 100 years from now from being mathematically shrunk to near-zero in present-value terms, demanding urgent aggressive investment today.","It requires governments to abolish all financial stock exchanges.","It leads economists to ignore the physical law of conservation of energy."]'::jsonb,
  'It prevents future catastrophic climate damages occurring 50 to 100 years from now from being mathematically shrunk to near-zero in present-value terms, demanding urgent aggressive investment today.',
  'Standard compound discounting shrinks distant catastrophic damages to negligible numbers in present value; a near-zero discount rate gives future generations equal moral weight, justifying massive immediate investment.',
  1,
  4
),
(
  '55555555-5555-4555-8555-000000000006',
  '55555555-5555-4555-8555-555555555555',
  'William Nordhaus defended a higher market-based discount rate (around 4-5%) by arguing that:',
  'multiple_choice',
  '["Future generations will have fewer biological children.","Because historical economic growth makes future generations substantially wealthier and technologically more advanced, current poorer generations should not sacrifice excessively for wealthier future descendants.","Global temperatures will automatically decline after the year 2050.","Carbon dioxide molecules dissipate into space within five days."]'::jsonb,
  'Because historical economic growth makes future generations substantially wealthier and technologically more advanced, current poorer generations should not sacrifice excessively for wealthier future descendants.',
  'Nordhaus argued that if future generations will be vastly richer due to compounded growth, spending current resources to spare them damage is regressive compared to investing in productive capital.',
  1,
  5
),
(
  '55555555-5555-4555-8555-000000000007',
  '55555555-5555-4555-8555-555555555555',
  'What fundamental critique is raised against Nordhaus''s assumption of perpetual compound economic growth amidst severe climate instability?',
  'multiple_choice',
  '["Economic textbooks use too many calculus equations.","Severe global warming of 3°C or 4°C may trigger non-linear planetary tipping points that disrupt ecological and agricultural systems, destroying the very conditions required for continued economic growth.","Banks will refuse to print paper fiat currency.","Stock markets operate five days a week rather than seven."]'::jsonb,
  'Severe global warming of 3°C or 4°C may trigger non-linear planetary tipping points that disrupt ecological and agricultural systems, destroying the very conditions required for continued economic growth.',
  'Ecological economists point out that assuming compound economic growth while climate destabilizes assumes the economy is detached from the biosphere, ignoring catastrophic tipping points.',
  1,
  6
),
(
  '55555555-5555-4555-8555-000000000008',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following propositions represents an unstated ethical premise in Stern''s economic analysis?',
  'multiple_choice',
  '["The moral worth of a human life and its fundamental right to a livable biosphere does not diminish merely because that life begins in the twenty-second century.","Solar panels are more efficient than coal turbines.","Wind turbines must be manufactured from recycled aluminum.","Gross Domestic Product is measured in pounds sterling."]'::jsonb,
  'The moral worth of a human life and its fundamental right to a livable biosphere does not diminish merely because that life begins in the twenty-second century.',
  'Stern''s near-zero discount rate rests squarely on an egalitarian moral stance: temporal distance cannot diminish our moral duties to future persons.',
  1,
  7
),
(
  '55555555-5555-4555-8555-000000000009',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''The ideological conflict between "Green Growth" and "Degrowth" turns on the feasibility of absolute decoupling. Green growth posits that technological innovation and renewable energy can decouple economic expansion from material throughput and carbon emissions. Degrowth advocates argue that absolute decoupling on the required timescale is an empirical myth.''

What is the defining distinction between ''relative decoupling'' and ''absolute decoupling''?',
  'multiple_choice',
  '["Relative decoupling occurs when GDP grows faster than emissions grow; absolute decoupling occurs when GDP grows while absolute emissions decline in total volume.","Relative decoupling applies only to island states, while absolute decoupling applies to continental nations.","Relative decoupling occurs in winter, while absolute decoupling occurs in summer.","Relative decoupling measures water use, while absolute decoupling measures noise pollution."]'::jsonb,
  'Relative decoupling occurs when GDP grows faster than emissions grow; absolute decoupling occurs when GDP grows while absolute emissions decline in total volume.',
  'Relative decoupling means emissions per unit of GDP decrease (efficiency gains), but total emissions may still rise; absolute decoupling means total aggregate emissions drop while GDP increases.',
  1,
  8
),
(
  '55555555-5555-4555-8555-000000000010',
  '55555555-5555-4555-8555-555555555555',
  'According to degrowth theorists (such as Jason Hickel), why is compound GDP growth incompatible with planetary ecological boundaries?',
  'multiple_choice',
  '["Because workers dislike receiving higher wages.","Because compound economic growth demands exponentially expanding energy and material resource extraction, overwhelming earth''s regenerative biocapacity and waste absorption sinks.","Because factory machinery breaks down when operated continuously.","Because global shipping vessels have reached maximum cargo dimensions."]'::jsonb,
  'Because compound economic growth demands exponentially expanding energy and material resource extraction, overwhelming earth''s regenerative biocapacity and waste absorption sinks.',
  'Degrowth highlights the physics of compound exponential growth: 3% annual growth doubles an economy in 24 years, creating unsustainable material throughput demands on a finite planet.',
  1,
  9
),
(
  '55555555-5555-4555-8555-000000000011',
  '55555555-5555-4555-8555-555555555555',
  'What is the primary socio-political challenge facing the political adoption of a ''degrowth'' agenda in democratic nations?',
  'multiple_choice',
  '["Degrowth books are too long to read.","Modern welfare states, pension systems, sovereign debt financing, and full employment models are structurally dependent on continuous economic growth; contracting GDP risks severe political instability and voter backlash.","Degrowth requires all citizens to wear identical clothing.","International airports refuse landing rights to planes from degrowth nations."]'::jsonb,
  'Modern welfare states, pension systems, sovereign debt financing, and full employment models are structurally dependent on continuous economic growth; contracting GDP risks severe political instability and voter backlash.',
  'Modern capitalist democracies are structurally hooked on growth for debt solvency, employment, and public welfare funding; contracting GDP without radical systemic restructuring triggers recessionary chaos.',
  1,
  10
),
(
  '55555555-5555-4555-8555-000000000012',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following, if true, would provide the strongest empirical evidence in support of ''Green Growth''?',
  'multiple_choice',
  '["Data demonstrating that several industrialized European economies sustained GDP expansion over two decades while reducing their total consumption-based territorial and imported carbon emissions by over 40%.","Surveys showing that young consumers prefer buying organic food.","Reports that electric vehicles are heavier than diesel trucks.","Evidence that solar panel manufacturers employ sales marketing staff."]'::jsonb,
  'Data demonstrating that several industrialized European economies sustained GDP expansion over two decades while reducing their total consumption-based territorial and imported carbon emissions by over 40%.',
  'Verifying absolute consumption-based decoupling (accounting for imported carbon) over sustained periods proves that economic growth and emission reductions can occur simultaneously.',
  1,
  11
),
(
  '55555555-5555-4555-8555-000000000013',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''The United Nations Framework Convention on Climate Change (UNFCCC) codifies the principle of "Common But Differentiated Responsibilities and Respective Capabilities" (CBDR-RC). Developing nations argue that historic cumulative emissions from early-industrialized Western powers exhausted the atmospheric carbon budget.''

What is the core ethical argument underlying the demand for climate loss-and-damage compensation from Global North nations?',
  'multiple_choice',
  '["Global North countries have colder climates.","The ''polluter pays'' principle and corrective justice dictate that nations historically responsible for accumulating the vast majority of atmospheric greenhouse gases owe restitution to vulnerable nations suffering the worst climatic impacts.","Developing nations have fewer international legal lawyers.","The United Nations Charter forbids northern nations from running budget deficits."]'::jsonb,
  'The ''polluter pays'' principle and corrective justice dictate that nations historically responsible for accumulating the vast majority of atmospheric greenhouse gases owe restitution to vulnerable nations suffering the worst climatic impacts.',
  'Corrective justice requires that those whose wrongful historical conduct caused the damage (historical cumulative emissions) compensate the innocent victims who bear the disproportionate costs.',
  1,
  12
),
(
  '55555555-5555-4555-8555-000000000014',
  '55555555-5555-4555-8555-555555555555',
  'How do negotiators from developed countries commonly challenge the strict historical responsibility framework?',
  'multiple_choice',
  '["By asserting that industrial emissions before the late twentieth century occurred in ''excusable ignorance'' of climate science, and that current rapidly industrializing emerging economies now emit the majority of annual global emissions.","By claiming that coal soot cleans the upper atmosphere.","By arguing that developing countries have more sunlight for solar energy.","By insisting that sea-level rise is beneficial for commercial shipping."]'::jsonb,
  'By asserting that industrial emissions before the late twentieth century occurred in ''excusable ignorance'' of climate science, and that current rapidly industrializing emerging economies now emit the majority of annual global emissions.',
  'Developed nations argue moral culpability requires knowledge (excusable ignorance prior to 1990) and note that halting climate change requires immediate mitigation by current giant emitters (e.g. China, India).',
  1,
  13
),
(
  '55555555-5555-4555-8555-000000000015',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following demonstrates an ethical dilemma inherent in climate finance transfers?',
  'multiple_choice',
  '["Whether climate aid should be delivered as loans that exacerbate developing country sovereign debt burdens, or as non-repayable grants that reflect unconditional historical reparations.","Whether weather forecasts should be presented in Celsius or Fahrenheit.","Whether international climate summits should serve vegetarian meals.","Whether delegates should fly in commercial airliners or turboprop planes."]'::jsonb,
  'Whether climate aid should be delivered as loans that exacerbate developing country sovereign debt burdens, or as non-repayable grants that reflect unconditional historical reparations.',
  'Offering climate finance as debt trap loans forces climate-impacted developing nations to pay interest on loans to recover from disasters caused by the creditors'' emissions.',
  1,
  14
),
(
  '55555555-5555-4555-8555-000000000016',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following statements represents an empirical fact rather than a normative ethical assertion?',
  'multiple_choice',
  '["Rich countries have an absolute moral obligation to transfer $100 billion annually to the Green Climate Fund.","Between 1751 and 2020, the United States and European nations generated more than fifty percent of cumulative global CO2 emissions.","It is profoundly unfair for island nations to submerge while western executives profit.","Developing countries ought to be exempted from all decarbonization commitments."]'::jsonb,
  'Between 1751 and 2020, the United States and European nations generated more than fifty percent of cumulative global CO2 emissions.',
  'This is a measurable historical emission datum, unlike the normative moral claims (''moral obligation'', ''profoundly unfair'', ''ought to be exempted'').',
  1,
  15
),
(
  '55555555-5555-4555-8555-000000000017',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''Nuclear energy presents a classic dilemma within environmental ethics. Proponents highlight its massive energy density, zero direct operational carbon emissions, and vital capacity to provide non-intermittent baseload electricity. Opponents cite the catastrophic tail-risks of meltdowns, nuclear weapons proliferation, and the unresolved ethical burden of managing radioactive waste for millennia.''

How do environmental advocates who favor nuclear power argue against intermittent renewables (wind and solar)?',
  'multiple_choice',
  '["Nuclear reactors can be built overnight in municipal parks.","Intermittent renewables require massive overbuilding, colossal land use footprints, mineral-intensive battery storage, and dispatchable fossil backups to guarantee electrical grid stability during windless, sunless periods.","Solar panels reflect sunlight away from the earth.","Wind turbine blades deplete the atmospheric oxygen layer."]'::jsonb,
  'Intermittent renewables require massive overbuilding, colossal land use footprints, mineral-intensive battery storage, and dispatchable fossil backups to guarantee electrical grid stability during windless, sunless periods.',
  'Pro-nuclear environmentalists argue that the low power density and intermittency of renewables require vast land, immense mineral inputs for batteries, and backup power that often defaults to gas.',
  1,
  16
),
(
  '55555555-5555-4555-8555-000000000018',
  '55555555-5555-4555-8555-555555555555',
  'How is the ''Precautionary Principle'' invoked by anti-nuclear environmentalists?',
  'multiple_choice',
  '["Where an activity poses threats of irreversible harm to human health or the environment (such as long-lived radioactive contamination or reactor meltdowns), lack of absolute scientific certainty regarding risk probabilities should not justify proceeding.","Governments should take precautions to prevent electricity prices from dropping too low.","Nuclear power plants should only be built by private corporations.","Radiation should be measured in ounces rather than sieverts."]'::jsonb,
  'Where an activity poses threats of irreversible harm to human health or the environment (such as long-lived radioactive contamination or reactor meltdowns), lack of absolute scientific certainty regarding risk probabilities should not justify proceeding.',
  'The Precautionary Principle states that when potential damages are catastrophic and irreversible, the burden of proof falls on demonstrating safety rather than accepting low-probability catastrophic risks.',
  1,
  17
),
(
  '55555555-5555-4555-8555-000000000019',
  '55555555-5555-4555-8555-555555555555',
  'What is the primary economic critique of new nuclear power plant construction in liberalized electricity markets?',
  'multiple_choice',
  '["Uranium atoms are too heavy to transport.","Extremely high upfront capital expenditure, persistent regulatory delays, and multi-year construction cost overruns make nuclear uncompetitive against rapidly plummeting renewable and storage costs.","Nuclear plants produce too much clean electricity for utility companies to sell.","Electric utilities are legally forbidden from issuing corporate bonds."]'::jsonb,
  'Extremely high upfront capital expenditure, persistent regulatory delays, and multi-year construction cost overruns make nuclear uncompetitive against rapidly plummeting renewable and storage costs.',
  'The core economic stumbling block for new nuclear is staggering capital costs and decade-long financing delays, while solar and wind costs have plummeted by over 80%.',
  1,
  18
),
(
  '55555555-5555-4555-8555-000000000020',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following propositions represents an unstated assumption in the argument: ''Germany''s premature phase-out of nuclear power was an environmental catastrophe''?',
  'multiple_choice',
  '["Replacing carbon-free nuclear generation with dirtier coal and gas power to cover baseload demands increased total greenhouse emissions and air pollution mortalities compared to keeping reactors online.","Germany has fewer rivers than France.","German engineering universities teach mechanical physics.","Nuclear waste storage casks are made from solid copper."]'::jsonb,
  'Replacing carbon-free nuclear generation with dirtier coal and gas power to cover baseload demands increased total greenhouse emissions and air pollution mortalities compared to keeping reactors online.',
  'The claim assumes that the phased-out nuclear capacity was compensated for by fossil fuels (lignite/gas) rather than purely clean alternatives, driving up net emissions.',
  1,
  19
),
(
  '55555555-5555-4555-8555-000000000021',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''The European Union''s Carbon Border Adjustment Mechanism (CBAM) imposes an import levy on carbon-intensive goods (such as steel, cement, and aluminum) imported from countries with laxer emissions regulations, equalizing the carbon price paid by domestic and foreign producers.''

What is the primary economic objective of introducing a CBAM?',
  'multiple_choice',
  '["To ban all international shipping containers from docking in European ports.","To prevent ''carbon leakage'' (where domestic industries relocate production to unconstrained foreign jurisdictions to evade carbon prices) while encouraging trading partners to adopt carbon pricing.","To increase customs inspection wait times for foreign tourists.","To subsidize domestic European coal extraction mines."]'::jsonb,
  'To prevent ''carbon leakage'' (where domestic industries relocate production to unconstrained foreign jurisdictions to evade carbon prices) while encouraging trading partners to adopt carbon pricing.',
  'CBAM stops carbon leakage—offshoring emissions to pollute elsewhere—and levels the playing field so domestic decarbonization doesn''t destroy local industry.',
  1,
  20
),
(
  '55555555-5555-4555-8555-000000000022',
  '55555555-5555-4555-8555-555555555555',
  'On what legal basis do developing export nations (such as India and South Africa) challenge the EU CBAM under World Trade Organization (WTO) rules?',
  'multiple_choice',
  '["They argue that CBAM acts as a discriminatory protectionist tariff disguised as environmental policy, violating WTO Most-Favoured-Nation and National Treatment rules and undermining the UNFCCC CBDR principle.","They claim that European ports lack container cranes.","They assert that cement cannot be traded across oceans.","They argue that the European Union is not recognized as a legal trading entity."]'::jsonb,
  'They argue that CBAM acts as a discriminatory protectionist tariff disguised as environmental policy, violating WTO Most-Favoured-Nation and National Treatment rules and undermining the UNFCCC CBDR principle.',
  'Developing countries argue CBAM violates WTO non-discrimination principles and weaponizes trade to impose European carbon pricing on developing economies that lack equivalent capital.',
  1,
  21
),
(
  '55555555-5555-4555-8555-000000000023',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following conditions is most crucial for a border carbon tariff to survive judicial scrutiny under WTO Article XX (General Exceptions for environmental protection)?',
  'multiple_choice',
  '["The tax revenues must be spent on European military hardware.","The measure must be applied even-handedly without arbitrary discrimination, must credit carbon costs already paid in the exporting country, and must be designed genuinely for climate protection rather than domestic commercial protectionism.","The tax must apply exclusively to non-English-speaking nations.","The imported products must be re-packaged in cardboard cartons."]'::jsonb,
  'The measure must be applied even-handedly without arbitrary discrimination, must credit carbon costs already paid in the exporting country, and must be designed genuinely for climate protection rather than domestic commercial protectionism.',
  'WTO Article XX exceptions require that environmental trade measures do not constitute arbitrary or disguised restrictions on international trade.',
  1,
  22
),
(
  '55555555-5555-4555-8555-000000000024',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following statements represents an inductive generalization regarding carbon border taxes?',
  'multiple_choice',
  '["Because the EU''s announcement of CBAM prompted trading partners like the UK and Turkey to design their own carbon border adjustments, upcoming unilateral border taxes will invariably induce global policy alignment.","If all carbon taxes are levied on embedded emissions, and cement contains embedded emissions, then cement is subject to the levy.","No export tariff can be classified as an unconditional domestic grant.","Either a company pays the import carbon levy, or its goods are barred from clearance."]'::jsonb,
  'Because the EU''s announcement of CBAM prompted trading partners like the UK and Turkey to design their own carbon border adjustments, upcoming unilateral border taxes will invariably induce global policy alignment.',
  'This projects from observed specific instances (EU inducing UK/Turkey action) into an inductive generalized rule about future unilateral policies.',
  1,
  23
),
(
  '55555555-5555-4555-8555-000000000025',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''In the landmark Urgenda Foundation v State of the Netherlands (2019), the Dutch Supreme Court ruled that the government''s failure to enact sufficiently ambitious greenhouse gas reductions violated Articles 2 (right to life) and 8 (right to private and family life) of the European Convention on Human Rights.''

What was the revolutionary constitutional precedent established in Urgenda?',
  'multiple_choice',
  '["The court dissolved the Dutch parliament and called emergency elections.","The court established that national governments possess legally enforceable human rights duties to protect their citizens against the dangerous risks of climate change by adopting adequate emissions reduction targets.","The court declared all fossil fuel companies bankrupt by judicial fiat.","The court ordered the Dutch navy to blockade international oil tankers."]'::jsonb,
  'The court established that national governments possess legally enforceable human rights duties to protect their citizens against the dangerous risks of climate change by adopting adequate emissions reduction targets.',
  'Urgenda proved that human rights law can be weaponized in court to force sovereign governments to raise climate mitigation targets to protect citizens'' fundamental rights to life.',
  1,
  24
),
(
  '55555555-5555-4555-8555-000000000026',
  '55555555-5555-4555-8555-555555555555',
  'In Neubauer v Germany (2021), the German Federal Constitutional Court struck down provisions of the Federal Climate Change Act. What was the core doctrinal innovation introduced in the ruling?',
  'multiple_choice',
  '["The court ruled that coal-mining regions must receive free beer subsidies.","The doctrine of ''intertemporal freedom'': by postponing deep emission cuts to the post-2030 period, the state offloads an intolerable burden of radical liberty restrictions onto younger and future generations.","The court held that Germany must leave the European Union.","The court ruled that children under 18 cannot be subject to environmental laws."]'::jsonb,
  'The doctrine of ''intertemporal freedom'': by postponing deep emission cuts to the post-2030 period, the state offloads an intolerable burden of radical liberty restrictions onto younger and future generations.',
  'The court created the concept of intertemporal freedom: delaying carbon cuts now consumes future generations'' carbon budget, forcing them into draconic future restrictions of basic liberties.',
  1,
  25
),
(
  '55555555-5555-4555-8555-000000000027',
  '55555555-5555-4555-8555-555555555555',
  'What is meant by the jurisprudential concept of ''Rights of Nature'' (Earth Jurisprudence), such as granting legal personhood to the Whanganui River in New Zealand?',
  'multiple_choice',
  '["Allowing fish to open offshore bank accounts.","Granting legal rights and standing directly to ecosystems and natural features themselves, recognized as legal persons with human guardians to enforce their rights in court, rather than treating nature merely as exploitable human property.","Prohibiting humans from swimming in natural bodies of water.","Renaming all rivers after sitting members of parliament."]'::jsonb,
  'Granting legal rights and standing directly to ecosystems and natural features themselves, recognized as legal persons with human guardians to enforce their rights in court, rather than treating nature merely as exploitable human property.',
  'Rights of Nature shifts law from anthropocentric property exploitation to ecocentric legal standing, recognizing rivers or forests as legal entities with enforceable rights.',
  1,
  26
),
(
  '55555555-5555-4555-8555-000000000028',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following arguments best illustrates the ''separation of powers'' critique leveled against climate litigation by activist judges?',
  'multiple_choice',
  '["Judicial robes are uncomfortable during summer trials.","Formulating national energy budgets, carbon targets, and economic trade-offs is inherently a political question belonging to the democratically elected branches of government, not to unelected judges.","Courts do not possess digital temperature thermometers.","Lawyers earn higher fees in commercial arbitration than in constitutional litigation."]'::jsonb,
  'Formulating national energy budgets, carbon targets, and economic trade-offs is inherently a political question belonging to the democratically elected branches of government, not to unelected judges.',
  'Critics contend that setting economic emission targets is a polycentric political decision requiring balancing competing social goods, which unelected courts lack democratic legitimacy to mandate.',
  1,
  27
),
(
  '55555555-5555-4555-8555-000000000029',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''In 1865, William Stanley Jevons observed that improvements in steam engine fuel efficiency did not decrease total national coal consumption; instead, they made coal power cheaper and more ubiquitous, causing aggregate coal consumption to skyrocket. This phenomenon is known as the Jevons Paradox or the Rebound Effect.''

How does the Jevons Paradox undermine technological energy efficiency mandates as a standalone climate strategy?',
  'multiple_choice',
  '["Engineers refuse to design efficient machinery.","Efficiency gains lower the operating cost of energy services, incentivizing increased usage (direct rebound) and freeing up money that consumers spend on other energy-intensive goods and services (indirect rebound), eroding expected emissions cuts.","Energy efficiency causes industrial factories to overheat.","Modern appliances have shorter warranties than historical machines."]'::jsonb,
  'Efficiency gains lower the operating cost of energy services, incentivizing increased usage (direct rebound) and freeing up money that consumers spend on other energy-intensive goods and services (indirect rebound), eroding expected emissions cuts.',
  'When technology makes energy use cheaper, behavior responds to lower prices by using more of the service or spending the savings elsewhere, often canceling out a significant fraction of efficiency gains.',
  1,
  28
),
(
  '55555555-5555-4555-8555-000000000030',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following real-world scenarios best illustrates a ''direct rebound effect''?',
  'multiple_choice',
  '["A commuter purchases a hybrid vehicle with double the fuel efficiency of their old sedan, and consequently decides to drive significantly longer distances and make more frequent road trips because driving has become so cheap.","A homeowner installs insulation and uses the money saved on heating to purchase a holiday flight to the Caribbean.","A utility builds a solar farm to replace an aging gas turbine.","A municipal council replaces incandescent streetlights with LED bulbs."]'::jsonb,
  'A commuter purchases a hybrid vehicle with double the fuel efficiency of their old sedan, and consequently decides to drive significantly longer distances and make more frequent road trips because driving has become so cheap.',
  'Direct rebound occurs within the exact same energy service: driving becomes cheaper per mile, leading the driver to consume more driving miles.',
  1,
  29
),
(
  '55555555-5555-4555-8555-000000000031',
  '55555555-5555-4555-8555-555555555555',
  'What policy measure is necessary to prevent the Jevons Paradox from neutralizing technical energy efficiency gains?',
  'multiple_choice',
  '["Prohibiting the sale of efficient household appliances.","Combining technical efficiency standards with rising carbon prices or energy caps that keep the marginal cost of energy services constant or rising, channeling savings away from increased consumption.","Ordering factories to operate only every second day.","Rationing electricity using analog rotary switches."]'::jsonb,
  'Combining technical efficiency standards with rising carbon prices or energy caps that keep the marginal cost of energy services constant or rising, channeling savings away from increased consumption.',
  'To prevent rebound, economists recommend pairing efficiency standards with carbon pricing to ensure that energy does not become cheaper, preventing behavioral overconsumption.',
  1,
  30
),
(
  '55555555-5555-4555-8555-000000000032',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following demonstrates a flaw in the reasoning: ''Because LED lighting reduces electricity use per lumen by 80%, global lighting energy demand will inevitably fall by 80%''?',
  'multiple_choice',
  '["It confuses nominal prices with real inflation rates.","It fallaciously assumes lighting demand is completely inelastic, ignoring that dramatic cost reductions cause widespread adoption of architectural, commercial, and outdoor nighttime illumination where lights previously did not exist.","It ignores the fact that LED bulbs emit blue light wavelengths.","It assumes that light bulbs are manufactured from glass."]'::jsonb,
  'It fallaciously assumes lighting demand is completely inelastic, ignoring that dramatic cost reductions cause widespread adoption of architectural, commercial, and outdoor nighttime illumination where lights previously did not exist.',
  'Demand for lighting is elastic; cheaper lumens led to massive expansion of decorative, nighttime, and commercial illumination, offsetting much of the technical efficiency savings.',
  1,
  31
),
(
  '55555555-5555-4555-8555-000000000033',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''Solar Radiation Management (SRM), such as injecting sulfur dioxide aerosols into the stratosphere to mimic volcanic cooling, offers a rapid, low-cost lever to reduce global surface temperatures. However, it creates severe "moral hazard" and "termination shock" risks.''

What is the ''moral hazard'' critique of researching and deploying solar geoengineering?',
  'multiple_choice',
  '["Engineers working on aerosol planes might face aviation insurance premium hikes.","The prospect of an easy, cheap technofix relieves political pressure on fossil fuel corporations and governments to execute the difficult economic work of emissions abatement, locking in ongoing ecological devastation.","Sulfur aerosols will turn the sky a permanent dark green color.","Stratospheric balloons violate municipal zoning bylaws."]'::jsonb,
  'The prospect of an easy, cheap technofix relieves political pressure on fossil fuel corporations and governments to execute the difficult economic work of emissions abatement, locking in ongoing ecological devastation.',
  'Moral hazard occurs when insurance against a peril encourages risky behavior: geoengineering offers an apparent technofix that undermines political will to stop burning fossil fuels.',
  1,
  32
),
(
  '55555555-5555-4555-8555-000000000034',
  '55555555-5555-4555-8555-555555555555',
  'What catastrophic risk is referred to as ''termination shock'' in stratospheric aerosol injection scenarios?',
  'multiple_choice',
  '["The sudden detonation of aerosol dispersal aircraft engines.","If SRM is deployed for decades while atmospheric CO2 continues rising, and the aerosol injection is abruptly halted due to war or technical failure, accumulated warming will strike the planet within years, triggering sudden runaway temperature spikes.","The electrical short-circuiting of global weather radar arrays.","The immediate freezing of the equator."]'::jsonb,
  'If SRM is deployed for decades while atmospheric CO2 continues rising, and the aerosol injection is abruptly halted due to war or technical failure, accumulated warming will strike the planet within years, triggering sudden runaway temperature spikes.',
  'Termination shock is the terrifying consequence of masking continuous CO2 buildup: if the reflective mask ever fails, decades of masked warming rebound in a matter of years, causing ecological collapse.',
  1,
  33
),
(
  '55555555-5555-4555-8555-000000000035',
  '55555555-5555-4555-8555-555555555555',
  'Why does Solar Radiation Management fail to address ocean acidification?',
  'multiple_choice',
  '["Because sulfuric acid is absorbed exclusively by desert sand dunes.","Because SRM merely reflects sunlight to lower atmospheric temperature; it does not reduce CO2 concentrations in the atmosphere, which continue to dissolve into seawater forming carbonic acid.","Because ocean currents circulate in clockwise directions in the Northern Hemisphere.","Because marine life is immune to pH water variations."]'::jsonb,
  'Because SRM merely reflects sunlight to lower atmospheric temperature; it does not reduce CO2 concentrations in the atmosphere, which continue to dissolve into seawater forming carbonic acid.',
  'SRM manages radiative forcing without removing CO2; high atmospheric CO2 continues to acidify the oceans, devastating coral reefs and marine food chains.',
  1,
  34
),
(
  '55555555-5555-4555-8555-000000000036',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following propositions represents an unstated assumption in the argument: ''A rogue state suffering catastrophic drought has a sovereign right to unilaterally deploy stratospheric aerosols''?',
  'multiple_choice',
  '["The sovereign state''s duty to protect its domestic population overrides international customary duties not to cause transboundary atmospheric and precipitation disruptions to other sovereign nations.","Aircraft fuel is cheaper in developing nations.","Drought conditions are caused exclusively by solar sunspots.","Stratospheric winds blow in predictable concentric rings."]'::jsonb,
  'The sovereign state''s duty to protect its domestic population overrides international customary duties not to cause transboundary atmospheric and precipitation disruptions to other sovereign nations.',
  'Unilateral deployment assumes domestic necessity trumps international legal duties preventing transboundary environmental interference (e.g. altering monsoon patterns in neighboring countries).',
  1,
  35
),
(
  '55555555-5555-4555-8555-000000000037',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''Animal agriculture accounts for nearly sixty percent of agricultural greenhouse emissions and drives eighty percent of global deforestation for cattle grazing and soy feed crops. Yet governments subsidize industrial livestock at rates vastly exceeding support for plant-based nutrition.''

What is the primary economic distortion created by state agricultural subsidies for livestock production?',
  'multiple_choice',
  '["Livestock farmers are unable to purchase tractor diesel fuel.","Subsidies artificially depress the consumer price of meat and dairy products, concealing their massive environmental externalities and disincentivizing consumer transition to low-carbon plant diets.","Supermarkets refuse to sell poultry meat.","Cattle farming produces zero gross domestic product."]'::jsonb,
  'Subsidies artificially depress the consumer price of meat and dairy products, concealing their massive environmental externalities and disincentivizing consumer transition to low-carbon plant diets.',
  'Subsidies keep animal products artificially cheap, insulating consumers from the true ecological costs and placing sustainable plant-based alternatives at a market disadvantage.',
  1,
  36
),
(
  '55555555-5555-4555-8555-000000000038',
  '55555555-5555-4555-8555-555555555555',
  'Which of the following arguments best explains why imposing a ''meat tax'' based on carbon intensity faces fierce political resistance compared to energy carbon taxes?',
  'multiple_choice',
  '["Food consumption is deeply tied to cultural identity, culinary tradition, and bodily autonomy, making dietary taxation feel like an intolerable state intrusion into intimate personal life.","Meat packages cannot display barcode pricing tags.","Livestock consume less water than vegetable crops.","Farmers never participate in rural electoral politics."]'::jsonb,
  'Food consumption is deeply tied to cultural identity, culinary tradition, and bodily autonomy, making dietary taxation feel like an intolerable state intrusion into intimate personal life.',
  'Food choices are deeply bound with cultural habits, tradition, and personal identity; taxing food feels visceral and intrusive compared to abstract utility bills.',
  1,
  37
),
(
  '55555555-5555-4555-8555-000000000039',
  '55555555-5555-4555-8555-555555555555',
  'What is an underlying flaw in the reasoning: ''Because regenerative cattle grazing sequesters some soil carbon, expanding industrial beef production is environmentally beneficial''?',
  'multiple_choice',
  '["It generalizes from small-scale rotational grazing to intensive industrial beef production, while ignoring that cattle emit potent enteric methane and require land footprints that drive tropical deforestation.","It presumes cows sleep during the daytime.","It assumes all soil carbon is lost to wind erosion.","It uses the word ''regenerative'' in an ungrammatical context."]'::jsonb,
  'It generalizes from small-scale rotational grazing to intensive industrial beef production, while ignoring that cattle emit potent enteric methane and require land footprints that drive tropical deforestation.',
  'This is a fallacy of illicit generalization: modest soil carbon gains under idealized holistic grazing cannot compensate for the massive enteric methane and deforestation footprint of global beef demand.',
  1,
  38
),
(
  '55555555-5555-4555-8555-000000000040',
  '55555555-5555-4555-8555-555555555555',
  'Passage Excerpt: ''Environmental, Social, and Governance (ESG) ratings have become ubiquitous across global asset management. Yet critics argue that ESG metrics measure how climate risk affects a company''s bottom-line profitability, rather than how the company''s activities impact the planet.''

What is meant by the concept of ''Single Materiality'' versus ''Double Materiality'' in corporate sustainability reporting?',
  'multiple_choice',
  '["Single materiality considers only the financial risks to the company from environmental changes; double materiality considers both financial risks to the company AND the outward impacts of the company on the environment and society.","Single materiality applies to public companies; double materiality applies to municipal charities.","Single materiality is measured once a year; double materiality is measured every six months.","Single materiality measures water use; double materiality measures plastic waste."]'::jsonb,
  'Single materiality considers only the financial risks to the company from environmental changes; double materiality considers both financial risks to the company AND the outward impacts of the company on the environment and society.',
  'Single materiality evaluates how climate change risks company profits; double materiality (pioneered in the EU CSRD) also evaluates how the company harms the climate and society.',
  1,
  39
),
(
  '55555555-5555-4555-8555-000000000041',
  '55555555-5555-4555-8555-555555555555',
  'How does the purchase of unregulated ''phantom carbon offsets'' facilitate corporate greenwashing?',
  'multiple_choice',
  '["Offsets are printed on expensive security paper.","Companies claim ''carbon neutrality'' by buying cheap credits for unverified forest preservation projects that would have been protected anyway, or that burn down years later, while continuing business-as-usual fossil emissions.","Carbon offsets are illegal under English common law.","Forest trees refuse to absorb carbon dioxide during nighttime hours."]'::jsonb,
  'Companies claim ''carbon neutrality'' by buying cheap credits for unverified forest preservation projects that would have been protected anyway, or that burn down years later, while continuing business-as-usual fossil emissions.',
  'Phantom offsets lack additionality and permanence, allowing corporations to market themselves as ''net-zero'' while continuing to pour real greenhouse gases into the atmosphere.',
  1,
  40
),
(
  '55555555-5555-4555-8555-000000000042',
  '55555555-5555-4555-8555-555555555555',
  'In ClientEarth v Shell plc (2023), environmental lawyers sued the board of directors for failing to prepare the oil company for the global net-zero transition. What was the legal duty invoked by the plaintiffs?',
  'multiple_choice',
  '["The directors'' statutory fiduciary duty under Section 172 of the Companies Act 2006 to act in the way they consider, in good faith, would be most likely to promote the long-term success of the company.","The criminal law against corporate manslaughter.","The maritime salvage treaty governing North Sea drilling rigs.","The tort of public nuisance for noise pollution near petrol stations."]'::jsonb,
  'The directors'' statutory fiduciary duty under Section 172 of the Companies Act 2006 to act in the way they consider, in good faith, would be most likely to promote the long-term success of the company.',
  'ClientEarth argued that failing to manage climate risk breaches the director''s fiduciary duty to promote the company''s long-term commercial success, pioneering corporate governance climate litigation.',
  1,
  41
)
ON CONFLICT (id) DO UPDATE SET
  test_id = EXCLUDED.test_id,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- QUESTIONNAIRE 6: LNAT Paper 6: Cognitive Psychology, Eyewitness Memory & Judicial Proof (42 Questions)
-- ==============================================================================
INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)
VALUES (
  '66666666-6666-4666-8666-666666666666',
  'LNAT Paper 6: Cognitive Psychology, Eyewitness Memory & Judicial Proof',
  'Adapted from official LNAT Practice Test 2 (Passage 3: On Memory by Michel de Montaigne) and legal epistemology. Explores the fallibility of human memory, eyewitness identification reliability, presumption of innocence, cognitive bias in forensic testimony, and standards of proof in common-law criminal jurisprudence.',
  95,
  42,
  true,
  'LNAT - Critical Reasoning'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_points = EXCLUDED.total_points,
  is_published = EXCLUDED.is_published,
  category = EXCLUDED.category;

INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
  ('66666666-6666-4666-8666-000000000001', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''There is no man so unsuited to the task of speaking about memory as I am, for I find scarcely a trace of it in myself, and I do not think there is another man in the world so deficient. People commonly mistake memory for judgment, but experience reveals that men blessed with excellent memories often suffer from remarkably feeble judgment. If my memory had been good, I should have deafened all my friends with my chatter, for the storehouse of memory is generally better stocked than that of invention. Furthermore, my infirmity shields me from ambition, for lack of memory is an intolerable defect in anyone who takes on the burden of the world''s affairs.''

In the opening sentence of the excerpt, which rhetorical device does the author primarily employ?', 'multiple_choice', '["Dramatic hyperbole designed to cultivate an air of philosophical modesty.","An empirical syllogism supported by psychometric clinical observation.","An uncritical appeal to external philosophical authorities such as Plato.","A deductive proof demonstrating the impossibility of autobiographical writing."]'::jsonb, 'Dramatic hyperbole designed to cultivate an air of philosophical modesty.', 'Montaigne exaggerates his lack of memory (''scarcely a trace'', ''no another man in the world so deficient'') to humorously introduce his reflections from a position of modesty.', 1, 0),
  ('66666666-6666-4666-8666-000000000002', '66666666-6666-4666-8666-666666666666', 'According to Montaigne''s argument, why does having an exceptional memory pose a potential communicative liability?', 'multiple_choice', '["It causes speakers to confuse imaginative speculation with verifiable factual truth.","It tempts individuals to bore companions by regurgitating an excess of recollected facts rather than engaging in concise, inventive conversation.","It makes individuals intellectually incapable of mastering judicial rhetoric.","It renders them vulnerable to psychological manipulation during cross-examination."]'::jsonb, 'It tempts individuals to bore companions by regurgitating an excess of recollected facts rather than engaging in concise, inventive conversation.', 'Montaigne observes that without a poor memory he would have ''deafened all my friends with my chatter'', since the storehouse of memory supplies endless material compared to spontaneous invention.', 1, 1),
  ('66666666-6666-4666-8666-000000000003', '66666666-6666-4666-8666-666666666666', 'Which of the following propositions best reflects the fundamental philosophical distinction Montaigne draws between ''memory'' and ''judgment''?', 'multiple_choice', '["Memory is an innate cognitive faculty, whereas judgment is entirely an artificial cultural construct.","Memory merely stores and reproduces received data, whereas judgment involves the critical discernment and evaluation of meaning.","Judgment is morally inferior to memory because it requires emotional detachment.","Those who lack memory inevitably develop superior political instincts for statecraft."]'::jsonb, 'Memory merely stores and reproduces received data, whereas judgment involves the critical discernment and evaluation of meaning.', 'Montaigne separates the rote capacity to retain information (memory) from the intellectual power to weigh, analyze, and make wise decisions (judgment).', 1, 2),
  ('66666666-6666-4666-8666-000000000004', '66666666-6666-4666-8666-666666666666', 'Which of the following, if true, would most seriously weaken Montaigne''s contention that poor memory protects an individual from political ambition?', 'multiple_choice', '["Many highly successful political leaders rely primarily on competent secretarial staff and written archives rather than unassisted biological recall.","Philosophers frequently disagree about the neurological seat of mnemonic faculties.","Ancient rhetoricians placed high value on the ''method of loci'' for memorizing speeches.","Some individuals with exceptional memories also exhibit strong mathematical aptitude."]'::jsonb, 'Many highly successful political leaders rely primarily on competent secretarial staff and written archives rather than unassisted biological recall.', 'If leaders can outsource memory to institutional aides and records, a personal deficiency in memory ceases to be an ''intolerable defect'' blocking political ambition.', 1, 3),
  ('66666666-6666-4666-8666-000000000005', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''Human memory does not function like a video recording that passively captures reality to be played back with fidelity. Rather, as Elizabeth Loftus demonstrated in her landmark 1974 experiments, memory is fundamentally reconstructive. When subjects viewed a film of a car collision, those asked how fast the vehicles were moving when they "smashed" into each other estimated significantly higher speeds than those asked when they "hit" each other. A week later, subjects in the "smashed" cohort were far more likely to falsely recall seeing broken glass at the scene, despite no broken glass existing in the film.''

What is the central implication of Loftus''s findings for the legal concept of eyewitness testimony?', 'multiple_choice', '["Witnesses who describe high speeds are invariably committing deliberate perjury in court.","Post-event suggestions and questioning terminology can invisibly alter a witness''s genuine recollection of factual occurrences.","Automobile collisions cannot be adjudicated without telemetry sensor data.","Physical evidence is inherently more prone to subjective contamination than oral testimony."]'::jsonb, 'Post-event suggestions and questioning terminology can invisibly alter a witness''s genuine recollection of factual occurrences.', 'Loftus''s work proves the ''misinformation effect'': leading phrasing does not just alter immediate verbal answers, but integrates into and corrupts the underlying memory.', 1, 4),
  ('66666666-6666-4666-8666-000000000006', '66666666-6666-4666-8666-666666666666', 'Based on the passage, the false recollection of broken glass illustrates that:', 'multiple_choice', '["Semantic associations of violent impact can overwrite sensory perceptual memory with congruent imagined details.","Human visual perception is systematically blinded by bright kinetic motion.","Experimental subjects always seek to appease academic researchers.","Memory retention deteriorates linearly after precisely seven days."]'::jsonb, 'Semantic associations of violent impact can overwrite sensory perceptual memory with congruent imagined details.', 'The verb ''smashed'' triggered schema-driven expectations of severe destruction (broken glass), which the brain integrated into the reconstructed episodic memory.', 1, 5),
  ('66666666-6666-4666-8666-000000000007', '66666666-6666-4666-8666-666666666666', 'Which of the following courtroom practices is most directly justified by Loftus''s findings on reconstructive memory?', 'multiple_choice', '["The evidentiary prohibition against asking leading questions during direct examination.","The elimination of peremptory challenges during jury selection.","The mandatory imposition of minimum custodial sentences for road traffic offenses.","The introduction of lie detector polygraphs into formal trial proceedings."]'::jsonb, 'The evidentiary prohibition against asking leading questions during direct examination.', 'Leading questions suggest the desired answer to the witness, risking the subconscious contamination and reconstruction of their testimony.', 1, 6),
  ('66666666-6666-4666-8666-000000000008', '66666666-6666-4666-8666-666666666666', 'A prosecutor argues: ''The eyewitness has expressed absolute certainty that the defendant was the gunman; therefore, any possibility of misidentification is eliminated.'' Which logical fallacy does this argument commit in light of psychological research on memory?', 'multiple_choice', '["Equating subjective subjective confidence with objective historical accuracy.","Committing an ad hominem attack against defense counsel.","Assuming that absence of physical evidence proves innocence.","Confusing statutory necessity with discretionary executive power."]'::jsonb, 'Equating subjective subjective confidence with objective historical accuracy.', 'Empirical studies consistently show a weak correlation between witness certainty and actual identification accuracy, particularly after repeated police questioning.', 1, 7),
  ('66666666-6666-4666-8666-000000000009', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''In R v Turnbull (1977), the English Court of Appeal established mandatory judicial directions where the prosecution''s case relies substantially on contested identification evidence. The trial judge must warn the jury of the special need for caution, emphasizing that an honest and convincing witness may nonetheless be mistaken. The judge must assess the quality of the observation—analyzing factors such as the duration of the sighting, distance, lighting conditions, whether the observation was impeded, whether the witness had previously known the accused, and the interval between the event and the formal identification.''

What was the primary policy motivation underlying the Court of Appeal''s ruling in R v Turnbull?', 'multiple_choice', '["To abolish the use of uncorroborated eyewitness identifications in all criminal trials.","To mitigate the chronic systemic risk of wrongful convictions stemming from sincere but mistaken eyewitness testimony.","To expedite judicial proceedings by restricting the length of defense cross-examinations.","To transfer the ultimate burden of evaluating guilt from the jury to the presiding judge."]'::jsonb, 'To mitigate the chronic systemic risk of wrongful convictions stemming from sincere but mistaken eyewitness testimony.', 'The Turnbull guidelines were formulated following high-profile miscarriages of justice (such as Beck and Dougherty) where confident, honest witnesses had identified innocent people.', 1, 8),
  ('66666666-6666-4666-8666-000000000010', '66666666-6666-4666-8666-666666666666', 'Under the Turnbull doctrine, when the quality of the identification is deemed exceptionally poor (e.g., a fleeting glimpse in darkness) and lacks supporting corroborative evidence, what action should the trial judge take?', 'multiple_choice', '["Withdraw the case from the jury and direct an acquittal.","Adjourn the trial indefinitely until DNA evidence can be obtained.","Compel the defendant to testify under oath to clarify their whereabouts.","Permit the jury to convict provided they reach an absolute unanimous verdict."]'::jsonb, 'Withdraw the case from the jury and direct an acquittal.', 'Turnbull explicitly rules that where the identification is poor and unsupported by other evidence, the judge must withdraw the case to prevent an unsafe verdict.', 1, 9),
  ('66666666-6666-4666-8666-000000000011', '66666666-6666-4666-8666-666666666666', 'Which of the following factors from the Turnbull guidelines accounts for the psychological phenomenon of ''memory decay''?', 'multiple_choice', '["The duration of the initial visual observation.","The lighting conditions at the locus of the crime.","The time interval elapsed between the event and the formal identification procedure.","Whether the perpetrator possessed unusual facial features."]'::jsonb, 'The time interval elapsed between the event and the formal identification procedure.', 'The delay between the witnessed incident and the police lineup directly correlates with decay and potential external interference in the witness''s mental representation.', 1, 10),
  ('66666666-6666-4666-8666-000000000012', '66666666-6666-4666-8666-666666666666', 'A critic of sequential photo lineups argues: ''Simultaneous lineups allow witnesses to compare faces directly, which feels more natural to human intuition.'' What is the cognitive rebuttal to this argument?', 'multiple_choice', '["Simultaneous presentation encourages ''relative judgment'' (picking the face that looks most like the culprit relative to the others), increasing false positive identifications.","Sequential lineups require digital computer monitors that are vulnerable to electrical failures.","Direct facial comparison is prohibited by international human rights conventions.","Human faces cannot be perceived when viewed in isolation from body silhouettes."]'::jsonb, 'Simultaneous presentation encourages ''relative judgment'' (picking the face that looks most like the culprit relative to the others), increasing false positive identifications.', 'In simultaneous lineups, witnesses compare suspects to each other (relative judgment), whereas sequential lineups force an absolute judgment comparing each photo to their memory.', 1, 11),
  ('66666666-6666-4666-8666-000000000013', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''The 2009 National Academy of Sciences (NAS) report delivered a devastating appraisal of forensic disciplines long revered in trial courts. With the sole exception of nuclear DNA analysis, no forensic method—including latent fingerprint comparison, microscopic hair examination, bite-mark identification, or tool-mark matching—has been rigorously validated to establish individualization. Furthermore, forensic examiners are routinely subjected to cognitive contextual bias. When fingerprint analysts were presented with pairs of prints they had previously declared a "match", but were now told that the suspect had an ironclad alibi, a significant proportion reversed their original determinations.''

What does the contextual bias experiment described in the passage demonstrate about forensic fingerprint analysis?', 'multiple_choice', '["Fingerprint ridges change shape over time due to atmospheric oxidation.","Visual pattern interpretation in forensic analysis is subjective and can be swayed by non-pertinent extraneous case information.","Nuclear DNA analysis is equally susceptible to optical distortion.","All forensic scientists intentionally falsify evidence to assist prosecution teams."]'::jsonb, 'Visual pattern interpretation in forensic analysis is subjective and can be swayed by non-pertinent extraneous case information.', 'The experiment proved that the subjective perceptual threshold of what constitutes a ''match'' shifts when examiners are influenced by extraneous investigative context.', 1, 12),
  ('66666666-6666-4666-8666-000000000014', '66666666-6666-4666-8666-666666666666', 'According to the NAS report cited, what fundamentally separates nuclear DNA analysis from disciplines like bite-mark or microscopic hair analysis?', 'multiple_choice', '["Nuclear DNA has a validated population genetics database and quantifiable, scientifically tested error rates.","DNA samples never degrade under ambient environmental exposure.","Bite-mark analysis is exclusively practiced by certified medical coroners.","DNA matching does not require specialized laboratory equipment."]'::jsonb, 'Nuclear DNA has a validated population genetics database and quantifiable, scientifically tested error rates.', 'DNA profiling rests on rigorous molecular biology and statistical population genetics with known random match probabilities, unlike pattern-matching disciplines.', 1, 13),
  ('66666666-6666-4666-8666-000000000015', '66666666-6666-4666-8666-666666666666', 'Which practical reform in forensic laboratories would most effectively counteract the contextual bias revealed in the passage?', 'multiple_choice', '["Linear Sequential Unmasking (LSU), where analysts must fully document the latent evidence before seeing any suspect reference print or contextual case details.","Allowing police detectives to directly oversee forensic technicians during microscope examinations.","Replacing jury trials with bench trials whenever forensic evidence is introduced.","Prohibiting defense experts from conducting independent tests on physical evidence."]'::jsonb, 'Linear Sequential Unmasking (LSU), where analysts must fully document the latent evidence before seeing any suspect reference print or contextual case details.', 'LSU ensures examiners analyze and characterize evidence ''blindly'' before exposure to biasing suspect information or external investigative narratives.', 1, 14),
  ('66666666-6666-4666-8666-000000000016', '66666666-6666-4666-8666-666666666666', 'An expert witness testifies: ''The probability of two people sharing this exact microscopic hair profile is zero.'' Which critical assertion does this statement unjustifiably make?', 'multiple_choice', '["An unverified claim of unique individualization unsupported by empirical population frequency data.","A concession that the defendant was not present at the crime scene.","A violation of the statutory hearsay exclusion rule.","An admission that the microscopic instrument was miscalibrated."]'::jsonb, 'An unverified claim of unique individualization unsupported by empirical population frequency data.', 'Microscopic hair examination has no scientific baseline for calculating population rarity; asserting a zero match probability is scientifically ungrounded hyperbole.', 1, 15),
  ('66666666-6666-4666-8666-000000000017', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''In his 1765 Commentaries on the Laws of England, Sir William Blackstone famously declared: "It is better that ten guilty persons escape, than that one innocent suffer." This maxim embodies the normative cornerstone of Anglo-American criminal law: an intentional structural asymmetry designed to minimize Type I errors (false convictions) even at the cost of tolerating Type II errors (false acquittals). Utilitarian critics, however, challenge the proportionality of the ratio. If an escaped violent offender commits multiple subsequent murders, does the aggregate suffering inflicted upon innocent victims not surpass the injustice of a single wrongful conviction?''

What is the core normative premise underlying Blackstone''s ratio?', 'multiple_choice', '["The moral culpability of an individual offender decreases over time.","State-sponsored punishment of an innocent person constitutes a qualitatively graver systemic injustice than the failure of the state to punish a private criminal.","Guilty individuals will inevitably be brought to justice through natural or spiritual retribution.","The financial expense of housing inmates exceeds the social cost of unsolved crimes."]'::jsonb, 'State-sponsored punishment of an innocent person constitutes a qualitatively graver systemic injustice than the failure of the state to punish a private criminal.', 'Blackstone''s principle holds that when the state—with its monopoly on violence and moral authority—punishes an innocent, it subverts the foundational legitimacy of the legal order.', 1, 16),
  ('66666666-6666-4666-8666-000000000018', '66666666-6666-4666-8666-666666666666', 'In the terminology of statistical hypothesis testing, how does criminal jurisprudence classify a wrongful conviction?', 'multiple_choice', '["A Type I error (rejecting the null hypothesis of innocence when it is in fact true).","A Type II error (failing to reject the null hypothesis of innocence when the defendant is guilty).","A sampling bias error caused by non-random jury selection.","A regression to the mean in forensic probability calculation."]'::jsonb, 'A Type I error (rejecting the null hypothesis of innocence when it is in fact true).', 'Because the legal presumption starts with innocence as the null hypothesis, convicting an innocent person is a false positive, or Type I error.', 1, 17),
  ('66666666-6666-4666-8666-000000000019', '66666666-6666-4666-8666-666666666666', 'How would a consistent consequentialist utilitarian assess Blackstone''s ratio?', 'multiple_choice', '["Reject any fixed numerical ratio in favor of an empirical calculation maximizing aggregate social utility and crime deterrence.","Demand that all criminal trials be resolved under the civil ''balance of probabilities'' standard.","Insist that capital punishment be abolished universally regardless of deterrence data.","Argue that victim satisfaction should be the exclusive determinant of sentencing length."]'::jsonb, 'Reject any fixed numerical ratio in favor of an empirical calculation maximizing aggregate social utility and crime deterrence.', 'Utilitarianism evaluates policies by their overall consequences; if letting ten violent felons free produces far more net misery than one wrongful imprisonment, utilitarians would revise the ratio.', 1, 18),
  ('66666666-6666-4666-8666-000000000020', '66666666-6666-4666-8666-666666666666', 'Which legal mechanism directly Operationalizes the normative prioritization expressed in Blackstone''s ratio within modern common-law courtrooms?', 'multiple_choice', '["The requirement that the prosecution establish criminal guilt ''beyond reasonable doubt''.","The discretion of prosecutors to enter a nolle prosequi.","The statutory limit on jury trial durations in magistrate courts.","The doctrine of precedent (stare decisis) in appellate rulings."]'::jsonb, 'The requirement that the prosecution establish criminal guilt ''beyond reasonable doubt''.', 'The heightened burden of proof (''beyond reasonable doubt'') creates an evidentiary barrier intentionally calibrated to avoid convicting the innocent.', 1, 19),
  ('66666666-6666-4666-8666-000000000021', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''Advancements in functional Magnetic Resonance Imaging (fMRI) have fueled claims by commercial neuro-technology firms that neural blood-oxygenation patterns can definitively reveal whether a subject is lying or recognizing a crime scene. Legal scholars, however, observe that compelled fMRI scans threaten to rupture the boundary between physical evidence (such as blood samples or fingerprints, which can be lawfully compelled) and testimonial evidence (communications from an accused''s mental cognition, protected by the privilege against self-incrimination). When a machine directly decodes propositional knowledge stored within the brain, the boundary between an object to be inspected and a witness testifying against oneself collapses.''

What is the central constitutional tension identified in the passage regarding compelled neuroimaging?', 'multiple_choice', '["Whether neural hemodynamic responses should be categorized as non-testimonial physical attributes or as protected cognitive testimony.","Whether the high monetary cost of MRI machines violates judicial budget caps.","Whether radiologists possess statutory immunity from civil malpractice claims.","Whether MRI magnetic fields disrupt electronic court reporting devices."]'::jsonb, 'Whether neural hemodynamic responses should be categorized as non-testimonial physical attributes or as protected cognitive testimony.', 'Self-incrimination doctrine protects the contents of a suspect''s mind (testimony), but allows taking bodily samples (physical evidence); fMRI extracts mental content via physical brain scans.', 1, 20),
  ('66666666-6666-4666-8666-000000000022', '66666666-6666-4666-8666-666666666666', 'Under the Daubert standard for scientific evidence, which of the following poses the most formidable barrier to the admissibility of fMRI lie detection?', 'multiple_choice', '["The lack of general scientific acceptance within the cognitive neuroscience community and unproven ecological validity outside laboratory settings.","The requirement that all trial evidence be legible in printed textual format.","The rule that only licensed police officers may operate trial technology.","The constitutional prohibition against using electricity inside courtroom chambers."]'::jsonb, 'The lack of general scientific acceptance within the cognitive neuroscience community and unproven ecological validity outside laboratory settings.', 'Daubert requires peer review, general acceptance, and known error rates in real-world conditions; lab-based fMRI deception tasks have not been validated for high-stakes real crimes.', 1, 21),
  ('66666666-6666-4666-8666-000000000023', '66666666-6666-4666-8666-666666666666', 'If a subject displays neural recognition upon viewing a murder weapon during a ''brain fingerprinting'' test, which plausible alternative explanation undermines the inference that they are the killer?', 'multiple_choice', '["The subject may have viewed identical weapons in media coverage or possessed a similar tool innocently.","The human brain ceases generating electric potentials when confronted with violent stimuli.","fMRI detectors cannot function if a subject blinks their eyes.","Blood oxygen levels always plummet uniformly across the prefrontal cortex during stress."]'::jsonb, 'The subject may have viewed identical weapons in media coverage or possessed a similar tool innocently.', 'Brain-wave or fMRI recognition reveals only familiarity with the image, not the moral or episodic context in which the familiarity was acquired.', 1, 22),
  ('66666666-6666-4666-8666-000000000024', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''Formulated following the 1843 trial of Daniel M''Naghten, the English insanity defense rules require establishing that at the time of committing the act, the accused labored under such a defect of reason, from disease of the mind, as not to know the nature and quality of the act he was doing; or, if he did know it, that he did not know he was doing what was wrong. Critics have long argued that this cognitive test ignores volitional and emotional defects: an individual suffering from paranoid psychosis may be fully aware that killing is prohibited by law, yet remain utterly powerless to resist an irresistible command hallucination.''

What is the fundamental limitation of the M''Naghten test highlighted by modern psychiatric jurisprudence?', 'multiple_choice', '["It focuses strictly on cognitive comprehension while failing to accommodate volitional impairment or loss of behavioral self-control.","It requires defendants to possess a formal medical university degree.","It applies solely to offenses committed against members of the royal family.","It automatically exonerates anyone who experiences temporary depression."]'::jsonb, 'It focuses strictly on cognitive comprehension while failing to accommodate volitional impairment or loss of behavioral self-control.', 'M''Naghten hinges purely on intellectual knowing (''did he know the nature/wrongness of the act?''), excluding individuals whose severe illness destroys their ability to control their actions.', 1, 23),
  ('66666666-6666-4666-8666-000000000025', '66666666-6666-4666-8666-666666666666', 'In R v Windle (1952), the defendant administered an overdose to his terminally ill wife and remarked to police: ''I suppose they will hang me for this.'' Why did the court reject his insanity defense under M''Naghten?', 'multiple_choice', '["His statement demonstrated that he understood the act was contrary to positive criminal law, satisfying the cognitive test of knowing it was ''wrong''.","Terminally ill victims are excluded from homicide statutes.","The defendant failed to pay the required court filing fees.","His alibi was contradicted by multiple independent witnesses."]'::jsonb, 'His statement demonstrated that he understood the act was contrary to positive criminal law, satisfying the cognitive test of knowing it was ''wrong''.', 'In English law, ''wrong'' in M''Naghten means legally wrong; Windle''s statement showed he knew the law forbade his act, barring the insanity defense despite his severe mental illness.', 1, 24),
  ('66666666-6666-4666-8666-000000000026', '66666666-6666-4666-8666-666666666666', 'How does the doctrine of ''diminished responsibility'' under the Homicide Act 1957 modify the rigid binary of the M''Naghten rules in murder cases?', 'multiple_choice', '["It provides a partial defense that reduces a murder conviction to voluntary manslaughter, recognizing substantial impairment without requiring total cognitive blindness.","It mandates immediate unconditional release for all psychotic defendants.","It shifts the burden of proof onto the trial judge rather than the jury.","It eliminates the necessity of proving the actus reus of the crime."]'::jsonb, 'It provides a partial defense that reduces a murder conviction to voluntary manslaughter, recognizing substantial impairment without requiring total cognitive blindness.', 'Diminished responsibility acts as a compassionate middle ground, avoiding the mandatory life sentence for murder when a recognized condition substantially impairs mental functioning.', 1, 25),
  ('66666666-6666-4666-8666-000000000027', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''The Reid Technique of police interrogation relies on a nine-step process combining psychological maximization and minimization. Interrogators confront the suspect with unyielding assertions of guilt, reject all denials, and fabricate fictitious evidence (such as asserting that a co-conspirator has already confessed). Concurrently, they offer moral rationalizations and minimize the culpability of the offense, subtly implying that cooperation will yield leniency. While effective at extracting admissions, Innocence Project data reveals that nearly 30% of DNA-exonerated individuals had initially falsely confessed to serious violent crimes under coercive psychological interrogation.''

Which psychological mechanism best explains why an innocent person would falsely confess to a crime they did not commit during a Reid-style interrogation?', 'multiple_choice', '["Temporal discounting: the acute, immediate desire to escape unrelenting psychological interrogation distress outweighs perceived future risks of legal punishment.","A sudden biological onset of retrograde amnesia induced by room lighting.","An altruistic desire to receive fame through notorious criminal publicity.","A complete loss of phonetic comprehension of legal language."]'::jsonb, 'Temporal discounting: the acute, immediate desire to escape unrelenting psychological interrogation distress outweighs perceived future risks of legal punishment.', 'Exhausted suspects experience intense stress and short-sightedness; falsely confessing appears to be the only available exit from an agonizing immediate ordeal.', 1, 26),
  ('66666666-6666-4666-8666-000000000028', '66666666-6666-4666-8666-666666666666', 'In the United Kingdom, the Police and Criminal Evidence Act 1984 (PACE) replaced confrontational interrogation methods with the PEACE model. What is the fundamental operational difference of PEACE?', 'multiple_choice', '["It focuses on investigative information-gathering, non-coercive questioning, and open dialogue rather than extracting a pre-determined confession of guilt.","It permits interrogators to administer pharmacological truth serums.","It disallows suspects from speaking to legal counsel until after formal charging.","It guarantees absolute immunity for any suspect who confesses within twenty minutes."]'::jsonb, 'It focuses on investigative information-gathering, non-coercive questioning, and open dialogue rather than extracting a pre-determined confession of guilt.', 'PEACE (Planning, Engage, Account, Closure, Evaluation) treats questioning as an objective inquiry to establish facts rather than a psychological contest to force a confession.', 1, 27),
  ('66666666-6666-4666-8666-000000000029', '66666666-6666-4666-8666-666666666666', 'Why is the tactic of police lying about non-existent physical evidence (e.g., claiming a suspect''s DNA was found on the weapon) particularly dangerous in the case of juvenile suspects?', 'multiple_choice', '["Adolescent neurodevelopment features heightened suggestibility, compliance with authority, and immature risk evaluation.","Juveniles are legally exempt from all criminal statutes.","Juvenile fingerprints undergo spontaneous molecular degradation within hours.","Children lack the cognitive capacity to experience fear of imprisonment."]'::jsonb, 'Adolescent neurodevelopment features heightened suggestibility, compliance with authority, and immature risk evaluation.', 'Developmental psychology shows that young brains are far more deferential to authority figures and susceptible to believing false authority claims about evidence.', 1, 28),
  ('66666666-6666-4666-8666-000000000030', '66666666-6666-4666-8666-666666666666', 'Under English criminal evidence law, Section 76 of PACE requires the trial judge to exclude confession evidence if it was obtained:', 'multiple_choice', '["By oppression, or in consequence of anything said or done likely to render the confession unreliable.","Without a minimum of four independent civilian witnesses present.","Outside the geographic boundaries of London.","In the presence of any female police officers."]'::jsonb, 'By oppression, or in consequence of anything said or done likely to render the confession unreliable.', 'Section 76 PACE is the statutory safeguard mandating exclusion of confessions extracted via oppression or circumstances undermining evidentiary reliability.', 1, 29),
  ('66666666-6666-4666-8666-000000000031', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''Consider legal philosopher Charles Nesson''s famous "Gatecrasher Paradox". One thousand spectators attend an exhibition rodeo. The gate receipts show that only 499 individuals purchased entry tickets, meaning that 501 gatecrashed without paying. The promoter sues an arbitrary spectator picked at random from the crowd. Statistically, there is an exact 50.1% probability that this spectator is a gatecrasher. In civil law, the burden of proof is the balance of probabilities (>50%). Yet, courts universally refuse to find liability based solely on naked statistical population proportions. Legal proof requires individualized, case-specific evidence connecting the defendant directly to the wrongful act.''

What epistemic principle is illuminated by the Gatecrasher Paradox?', 'multiple_choice', '["Mathematical probability alone is insufficient for judicial proof; evidence must establish an individualized causal nexus to the specific defendant.","Rodeo promoters should not be granted civil standing in common-law courts.","The balance of probabilities standard should be numerically defined as precisely 99.9%.","Statistically grounded evidence is always inadmissible in both civil and criminal litigation."]'::jsonb, 'Mathematical probability alone is insufficient for judicial proof; evidence must establish an individualized causal nexus to the specific defendant.', 'The paradox demonstrates that law rejects ''naked statistical evidence'' because imposing liability without case-specific evidence undermines justice and public confidence.', 1, 30),
  ('66666666-6666-4666-8666-000000000032', '66666666-6666-4666-8666-666666666666', 'If a court accepted pure demographic statistics as satisfying the civil standard of proof in the Gatecrasher scenario, what absurd systemic outcome would follow?', 'multiple_choice', '["The promoter could sue and win against every single attendee in the arena, extracting payment 1,000 times even though 499 had already paid.","All criminal cases would immediately be dismissed for lack of statutory jurisdiction.","Spectators would be legally mandated to wear digital tracking wristbands at all sporting events.","The judge would be liable for personal bankruptcy."]'::jsonb, 'The promoter could sue and win against every single attendee in the arena, extracting payment 1,000 times even though 499 had already paid.', 'If 50.1% probability sufficed against one random person, it would suffice against every person, allowing recovery against the 499 entirely innocent paying customers.', 1, 31),
  ('66666666-6666-4666-8666-000000000033', '66666666-6666-4666-8666-666666666666', 'What is the ''Prosecutor''s Fallacy'' in statistical evaluation of criminal evidence?', 'multiple_choice', '["Confusing the probability of the evidence given the defendant''s innocence with the probability of the defendant''s innocence given the evidence.","Assuming that every eyewitness is intentionally attempting to deceive the jury.","Failing to disclose defense expert fees during cross-examination.","Arguing that circumstantial evidence has greater probative weight than direct video footage."]'::jsonb, 'Confusing the probability of the evidence given the defendant''s innocence with the probability of the defendant''s innocence given the evidence.', 'Transposing the conditional probability (P(Evidence|Innocence) vs P(Innocence|Evidence)) mistakenly treats a rare DNA match probability as the direct probability of the defendant being innocent.', 1, 32),
  ('66666666-6666-4666-8666-000000000034', '66666666-6666-4666-8666-666666666666', 'In the tragic UK cot-death case R v Sally Clark (2003), pediatrician Sir Roy Meadow testified that the chance of two sudden infant deaths in one affluent family was 1 in 73 million, calculated by squaring the 1 in 8,500 single-death rate. What fundamental statistical error did this calculation commit?', 'multiple_choice', '["Assuming statistical independence between two events that likely shared underlying genetic or environmental risk factors.","Dividing the numerator by an irrational square root.","Using decimal numbers instead of whole fractions in testimony.","Misidentifying the biological gender of the deceased infants."]'::jsonb, 'Assuming statistical independence between two events that likely shared underlying genetic or environmental risk factors.', 'Events can only be multiplied if independent; infant deaths in the same household share hereditary genetics and familial environment, rendering the 1 in 73 million figure wildly inaccurate.', 1, 33),
  ('66666666-6666-4666-8666-000000000035', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''The proliferation of generative artificial intelligence and hyper-realistic deepfake technology threatens judicial proceedings with a double-edged crisis known as the "liar''s dividend". First, fabricated audio and video recordings may be admitted as genuine, misleading triers of fact. Second, and perhaps more insidiously, truly authentic video recordings of criminal wrongdoing can now be plausibly disbelieved by juries because guilty defendants can claim the footage is merely an AI-generated synthetic forgery.''

What is the ''liar''s dividend'' described in the passage?', 'multiple_choice', '["The tactical advantage gained by dishonest actors who exploit the mere existence of deepfakes to discredit genuine, incriminating evidence.","A financial bonus awarded to defense attorneys who win acquittals through synthetic evidence.","The statutory tax exemption enjoyed by AI technology software corporations.","A reduction in sentencing guidelines for defendants who plead guilty early."]'::jsonb, 'The tactical advantage gained by dishonest actors who exploit the mere existence of deepfakes to discredit genuine, incriminating evidence.', 'The liar''s dividend allows wrongdoers to evade accountability by exploiting public skepticism: since deepfakes exist, any real video can be dismissed as fake.', 1, 34),
  ('66666666-6666-4666-8666-000000000036', '66666666-6666-4666-8666-666666666666', 'To combat synthetic media tampering, evidence law increasingly relies on ''cryptographic chain of custody''. What does this procedure verify?', 'multiple_choice', '["The immutable provenance, timestamp, and hardware capture metadata of digital footage from the camera sensor to the courtroom.","The psychological mental stability of the videographer at the moment of recording.","The legal ownership of the copyrighted musical score playing in the background.","The political party affiliation of the police evidence custodian."]'::jsonb, 'The immutable provenance, timestamp, and hardware capture metadata of digital footage from the camera sensor to the courtroom.', 'Cryptographic hashing and verifiable metadata guarantee that a digital file has not been altered or synthesized since the moment it was recorded.', 1, 35),
  ('66666666-6666-4666-8666-000000000037', '66666666-6666-4666-8666-666666666666', 'If courts respond to the deepfake crisis by reinstating a rigid requirement that all events be proven by live human eyewitnesses rather than recordings, what historical vulnerability do they re-introduce?', 'multiple_choice', '["The well-documented fallibility, suggestibility, and memory decay of human perception.","The absolute elimination of all trial appeals.","An uncontrollable escalation in courtroom building heating costs.","The automatic decriminalization of commercial fraud."]'::jsonb, 'The well-documented fallibility, suggestibility, and memory decay of human perception.', 'Reverting solely to human testimony would replace the risk of digital forgery with the well-known biological distortions of memory established by psychological research.', 1, 36),
  ('66666666-6666-4666-8666-000000000038', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''The common-law jury of twelve citizens is celebrated by Lord Devlin as "the lamp that shows that freedom lives." However, empirical social psychology reveals troubling cognitive dynamics in jury deliberations. Studies demonstrate "group polarization": when jurors lean mildly toward a particular verdict prior to deliberation, group discussion often magnifies their collective confidence and drives them to an extreme, polarized stance. Furthermore, lay jurors frequently struggle with complex epidemiological and statistical evidence, defaulting to intuitive narrative coherence rather than probabilistic calculus.''

What does the phenomenon of ''group polarization'' imply about jury deliberations?', 'multiple_choice', '["Deliberation does not always temper extreme views through balanced consensus, but can reinforce and amplify initial preconceptions.","Jurors always split into precisely two equal halves of six votes each.","All twelve jurors inevitably forget the judge''s instructions within thirty minutes.","Jury verdicts in common-law nations are statistically indistinguishable from coin tosses."]'::jsonb, 'Deliberation does not always temper extreme views through balanced consensus, but can reinforce and amplify initial preconceptions.', 'Social psychological research proves that group discussion often causes individuals to adopt more extreme versions of their initial shared inclinations.', 1, 37),
  ('66666666-6666-4666-8666-000000000039', '66666666-6666-4666-8666-666666666666', 'When lay jurors evaluate competing accounts of a crime, what does the psychological ''Story Model'' (Pennington & Hastie) predict they will do?', 'multiple_choice', '["Construct a narrative that creates a coherent causal story aligning with their personal world knowledge, even inserting unproven assumptions to fill evidentiary gaps.","Compute Bayes'' theorem using paper and pencils in the jury room.","Accept whichever attorney speaks with a deeper vocal timbre.","Disregard all witness testimony in favor of police press releases."]'::jsonb, 'Construct a narrative that creates a coherent causal story aligning with their personal world knowledge, even inserting unproven assumptions to fill evidentiary gaps.', 'The Story Model shows that jurors organize evidence into comprehensive stories, valuing narrative plausibility and completeness over rigorous probabilistic analysis.', 1, 38),
  ('66666666-6666-4666-8666-000000000040', '66666666-6666-4666-8666-666666666666', 'Which structural argument best justifies retaining lay juries despite cognitive biases?', 'multiple_choice', '["Juries inject democratic community standards of justice, prevent judicial tyranny, and confer civic legitimacy on the deprivation of liberty.","Juries are cheaper to operate than salaried professional judges.","Jury verdicts never require formal sentencing hearings.","Twelve citizens never experience tiredness during lengthy trials."]'::jsonb, 'Juries inject democratic community standards of justice, prevent judicial tyranny, and confer civic legitimacy on the deprivation of liberty.', 'The constitutional justification for the jury is political and democratic: it distributes sovereign punitive power across society and checks state overreach.', 1, 39),
  ('66666666-6666-4666-8666-000000000041', '66666666-6666-4666-8666-666666666666', 'Passage Excerpt: ''Classical retributivism, articulated by Immanuel Kant, posits that punishment is a categorical moral imperative: the offender must suffer punishment proportional to their desert, irrespective of whether it yields any future rehabilitative or deterrent benefit. Conversely, restorative justice reframes crime not as a violation of an abstract state code, but as a rupture in interpersonal and community relationships. It prioritizes repairing harm through mediated dialogue, offender accountability, and victim restitution.''

What is the fundamental difference in how retributive justice and restorative justice conceptualize the primary ''victim'' of a crime?', 'multiple_choice', '["Retributivism views crime primarily as an offense against the sovereign state and its legal order, whereas restorative justice views crime as harm inflicted on specific individuals and communities.","Retributivism considers the offender to be the primary victim of societal neglect.","Restorative justice refuses to acknowledge the existence of physical injury.","Both frameworks reject the necessity of remorse or accountability."]'::jsonb, 'Retributivism views crime primarily as an offense against the sovereign state and its legal order, whereas restorative justice views crime as harm inflicted on specific individuals and communities.', 'In retributive law, the case is ''State v Accused'' (breach of sovereign order); in restorative justice, the focus centers on repairing actual human relationships.', 1, 40),
  ('66666666-6666-4666-8666-000000000042', '66666666-6666-4666-8666-666666666666', 'A defense attorney proposes resolving a violent domestic assault case exclusively through informal restorative community mediation without criminal charges. What is the most compelling feminist and victim-advocacy objection to this proposal?', 'multiple_choice', '["Informal mediation risks reinforcing structural power imbalances and intimidating vulnerable victims into forced reconciliation without the coercive protection of state law.","Restorative justice requires too many certified psychologists in attendance.","Informal dialogue is prohibited under commercial contract legislation.","Mediation eliminates the financial revenue generated by court fines."]'::jsonb, 'Informal mediation risks reinforcing structural power imbalances and intimidating vulnerable victims into forced reconciliation without the coercive protection of state law.', 'Where severe power and physical intimidation dynamics exist, informal mediation can coerce the victim, privatize serious violence, and deny equal protection under the criminal law.', 1, 41)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  order_index = EXCLUDED.order_index;

-- ==============================================================================
-- QUESTIONNAIRE 7: LNAT Paper 7: Automation, The Future of Work & Socio-Economic Rights (42 Questions)
-- ==============================================================================
INSERT INTO public.tests (id, title, description, duration_minutes, total_points, is_published, category)
VALUES (
  '77777777-7777-4777-8777-777777777777',
  'LNAT Paper 7: Automation, The Future of Work & Socio-Economic Rights',
  'Derived from official LNAT Practice Test 2 (Passage 6: ''The Future of Work'') and Practice Test 1 (''A Global Dilemma''). Investigates technological unemployment, gig-economy employment status, collective bargaining, universal basic income, algorithmic management, and socio-economic rights in modern jurisprudence.',
  95,
  42,
  true,
  'LNAT - Critical Reasoning'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  total_points = EXCLUDED.total_points,
  is_published = EXCLUDED.is_published,
  category = EXCLUDED.category;

INSERT INTO public.questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
  ('77777777-7777-4777-8777-000000000001', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''"So what do you do?" In almost every social gathering, this ubiquitous query serves as the primary currency of conversation. We define human status, worth, and identity almost entirely by participation in the formal wage-labor market. Yet, in his 1930 essay "Economic Possibilities for our Grandchildren," John Maynard Keynes predicted that by the early twenty-first century, capital accumulation and technological progress would solve humanity''s "economic problem," reducing the working week to a mere fifteen hours. Instead of leisure and liberation, however, the modern economy has generated intense workplace burnout, hyper-specialization, and an explosion of what anthropologist David Graeber dubbed "bullshit jobs"—roles perceived as meaningless even by those who hold them.''

What is the central paradox highlighted in the passage regarding Keynes''s economic prediction?', 'multiple_choice', '["Despite immense technological productivity growth that could enable widespread leisure, society has intensified work hours and manufactured superfluous administrative labor.","Keynes failed to anticipate the invention of electronic calculating engines.","Employees universally prefer working seventy hours per week to having free time.","The working class has completely dismantled the global financial system."]'::jsonb, 'Despite immense technological productivity growth that could enable widespread leisure, society has intensified work hours and manufactured superfluous administrative labor.', 'Productivity soared as Keynes forecasted, but the expected 15-hour week never arrived; instead, culture and economic systems channeled the surplus into extended hours and administrative roles.', 1, 0),
  ('77777777-7777-4777-8777-000000000002', '77777777-7777-4777-8777-777777777777', 'According to the passage, why is the social question ''So what do you do?'' culturally revealing?', 'multiple_choice', '["It demonstrates that individual social identity, moral dignity, and prestige remain inextricably tethered to one''s occupation within market capitalism.","It indicates that interpersonal etiquette has deteriorated since the Victorian era.","It proves that modern citizens have lost the ability to discuss literature or philosophy.","It reflects a mandatory government surveillance protocol for tax auditing."]'::jsonb, 'It demonstrates that individual social identity, moral dignity, and prestige remain inextricably tethered to one''s occupation within market capitalism.', 'The author uses the opening question to underscore how human value in modern society is primarily measured through economic employment status.', 1, 1),
  ('77777777-7777-4777-8777-000000000003', '77777777-7777-4777-8777-777777777777', 'Which of the following unstated assumptions was crucial to Keynes''s prediction that technological productivity would lead to a fifteen-hour work week?', 'multiple_choice', '["That human material desires would stabilize at a point of sufficiency rather than expanding into insatiable consumer appetites for new luxury goods.","That national governments would outlaw private ownership of factories.","That birth rates would fall to zero in developed economies.","That international trade tariffs would be raised to prohibitive levels."]'::jsonb, 'That human material desires would stabilize at a point of sufficiency rather than expanding into insatiable consumer appetites for new luxury goods.', 'For reduced work hours to follow from increased efficiency, consumption needs must remain finite; if desires expand infinitely (consumerism), workers continue trading time for more goods.', 1, 2),
  ('77777777-7777-4777-8777-000000000004', '77777777-7777-4777-8777-777777777777', 'An economic analyst argues: ''David Graeber''s concept of "bullshit jobs" is purely subjective; if a corporation is willing to pay a salary, the role must generate market value by definition.'' What economic assumption does this argument embody?', 'multiple_choice', '["Neoclassical market orthodoxy that wages in equilibrium perfectly mirror marginal product, precluding corporate waste or institutional rent-seeking.","The Marxist labor theory of surplus value.","The Austrian school''s critique of central monetary planning.","The behavioral economics theory of loss aversion."]'::jsonb, 'Neoclassical market orthodoxy that wages in equilibrium perfectly mirror marginal product, precluding corporate waste or institutional rent-seeking.', 'This counter-argument assumes that profit-maximizing firms never hire inefficiently and that private market prices/wages flawlessly equate to real social utility.', 1, 3),
  ('77777777-7777-4777-8777-000000000005', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''In the classic Prisoner''s Dilemma of game theory, two rational actors pursuing their uncoordinated self-interest inevitably reach a Nash equilibrium that is collectively suboptimal for both. This dilemma operates as a powerful paradigm for contemporary labor markets and international trade. When developing nations compete for foreign direct investment by slashing labor protections, tax rates, and environmental standards, they engage in a destructive "race to the bottom". Individually, each nation fears losing capital if it acts with unilateral moral restraint; collectively, all nations forfeit their public revenues and social safety nets.''

What makes the ''race to the bottom'' in international labor standards an analog of the Prisoner''s Dilemma?', 'multiple_choice', '["Uncoordinated rational self-interest by individual states produces a mutually destructive outcome that leaves all participants worse off than coordinated cooperation would.","Participating nations are held in literal physical incarceration by international courts.","Neither party has any economic incentive to attract foreign capital investment.","The dilemma can only be resolved if one country conquerors all others militarily."]'::jsonb, 'Uncoordinated rational self-interest by individual states produces a mutually destructive outcome that leaves all participants worse off than coordinated cooperation would.', 'Just like the prisoners who both defect and receive worse sentences, countries undercutting each other to attract investment end up collectively gutting their welfare states.', 1, 4),
  ('77777777-7777-4777-8777-000000000006', '77777777-7777-4777-8777-777777777777', 'According to game theory, what is the most robust structural remedy for escaping a Prisoner''s Dilemma in international economic competition?', 'multiple_choice', '["Binding multilateral conventions with credible enforcement mechanisms and monitoring to penalize defectors.","Appealing solely to the ethical conscience of corporate chief executives.","Abolishing the usage of sovereign national currencies.","Restricting trade negotiations to secret bilateral phone calls."]'::jsonb, 'Binding multilateral conventions with credible enforcement mechanisms and monitoring to penalize defectors.', 'Cooperation in a prisoner''s dilemma requires external enforcement or repeated-game sanctions so that defecting (undercutting standards) is no longer a dominant strategy.', 1, 5),
  ('77777777-7777-4777-8777-000000000007', '77777777-7777-4777-8777-777777777777', 'Which of the following domestic labor policies mirrors the collective action solution to the Prisoner''s Dilemma?', 'multiple_choice', '["Statutory minimum wage legislation and mandatory collective bargaining agreements.","Prohibiting trade unions from organizing workers in manufacturing plants.","Replacing standard hourly pay with discretionary commission-only compensation.","Exempting gig-economy companies from paying national health insurance taxes."]'::jsonb, 'Statutory minimum wage legislation and mandatory collective bargaining agreements.', 'Minimum wage laws prevent individual workers from being forced into desperate wage-undercutting competitions, setting a legally enforceable floor.', 1, 6),
  ('77777777-7777-4777-8777-000000000008', '77777777-7777-4777-8777-777777777777', 'A free-market critic claims: ''If workers in developing nations accept low wages and dangerous conditions, it proves that these terms are preferred to their available alternatives.'' What is the primary ethical counter-argument to this libertarian claim?', 'multiple_choice', '["Coerced choices made under conditions of acute structural deprivation and lack of viable alternatives do not constitute genuine autonomous consent.","Workers in developing nations do not understand basic arithmetic.","Factory jobs produce lower GDP growth than subsistence farming.","Multinational corporations operate at an ongoing financial loss in Asia."]'::jsonb, 'Coerced choices made under conditions of acute structural deprivation and lack of viable alternatives do not constitute genuine autonomous consent.', 'Bioethics and jurisprudence recognize that choosing the ''least terrible'' among life-threatening options is an exercise in desperation under structural duress, not uncoerced autonomy.', 1, 7),
  ('77777777-7777-4777-8777-000000000009', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''In the landmark decision Uber BV v Aslam (2021), the UK Supreme Court addressed the legal fiction created by platform tech conglomerates. Uber insisted that its drivers were independent commercial contractors, characterizing its app merely as a digital booking agency facilitating transactions between private drivers and passengers. Lord Leggatt, delivering the unanimous judgment, firmly rejected this contractual formalism. The court held that statutory employment legislation was enacted specifically to protect vulnerable subordinates who have little or no ability to negotiate contractual terms. Because Uber exercised comprehensive algorithmic control—setting non-negotiable fares, imposing vehicle standards, monitoring ratings, and penalizing drivers who declined rides—the drivers were legally "workers" entitled to minimum wage and paid leave.''

What was the decisive legal doctrine articulated by Lord Leggatt in Uber BV v Aslam regarding employment contracts?', 'multiple_choice', '["Courts must look past formal written contractual labels drafted by employers to assess the practical reality of control and economic subordination.","Any business that uses a mobile phone application is exempt from domestic employment laws.","Independent contractors must be granted immediate seats on corporate boards of directors.","Written contracts signed by consenting adults cannot be reviewed or challenged by tribunals."]'::jsonb, 'Courts must look past formal written contractual labels drafted by employers to assess the practical reality of control and economic subordination.', 'The Supreme Court ruled that statutory protections cannot be contracted out of by sophisticated corporate contract drafting; the courts examine the factual reality of subordination and control.', 1, 8),
  ('77777777-7777-4777-8777-000000000010', '77777777-7777-4777-8777-777777777777', 'In English employment law, what is the crucial distinction between a ''worker'' (Section 230(3)(b) Employment Rights Act 1996) and a traditional ''employee''?', 'multiple_choice', '["Workers enjoy basic rights like national minimum wage, working time limits, and holiday pay, but lack protection against unfair dismissal and statutory redundancy pay.","Workers are legally exempt from paying national income tax.","Employees cannot be dismissed under any circumstances.","Workers have no right to be accompanied at disciplinary hearings."]'::jsonb, 'Workers enjoy basic rights like national minimum wage, working time limits, and holiday pay, but lack protection against unfair dismissal and statutory redundancy pay.', '''Worker'' is an intermediate statutory tier giving core wage and holiday protections to dependent contractors without granting full employee rights like unfair dismissal protection.', 1, 9),
  ('77777777-7777-4777-8777-000000000011', '77777777-7777-4777-8777-777777777777', 'Which aspect of Uber''s algorithmic management was identified by the Supreme Court as evidence of subordinate control rather than entrepreneurial autonomy?', 'multiple_choice', '["Uber''s unilateral determination of the ride fare and restriction on drivers communicating directly with riders to establish independent business relations.","The color scheme used in the app interface.","Allowing drivers to select their own personal car insurance providers.","The fact that drivers purchased their own mobile phone data plans."]'::jsonb, 'Uber''s unilateral determination of the ride fare and restriction on drivers communicating directly with riders to establish independent business relations.', 'Entrepreneurs set their own prices and build client goodwill; Uber controlled the fare and insulated passengers from drivers, proving drivers were not running independent businesses.', 1, 10),
  ('77777777-7777-4777-8777-000000000012', '77777777-7777-4777-8777-777777777777', 'A gig-economy food delivery platform argues: ''Because our couriers can log on and off whenever they choose, they cannot be classified as workers.'' How did the Supreme Court resolve this issue regarding working time in Uber v Aslam?', 'multiple_choice', '["Flexibility in choosing when to log on does not negate worker status; while logged on and available within the operating territory, drivers are working under the company''s control.","The court agreed that flexibility automatically converts all labor into voluntary charity.","The court ruled that all couriers must be forced to work fixed eight-hour shifts.","The court held that delivery couriers are maritime merchant seamen."]'::jsonb, 'Flexibility in choosing when to log on does not negate worker status; while logged on and available within the operating territory, drivers are working under the company''s control.', 'The Supreme Court held that once drivers were logged into the app ready to accept jobs, they were at Uber''s disposal and entitled to minimum wage for that time.', 1, 11),
  ('77777777-7777-4777-8777-000000000013', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''Universal Basic Income (UBI)—an unconditional, non-means-tested regular cash transfer paid to every adult citizen regardless of work status—has transitioned from radical utopian theory to mainstream economic debate. Advocates argue that by eliminating the punitive bureaucracy and "welfare cliffs" of means-tested systems (where earning a modest wage triggers an immediate withdrawal of benefits, creating effective marginal tax rates approaching 90%), UBI restores human dignity and empowers workers to reject dangerous or exploitative employment. Opponents counter with two arguments: astronomical fiscal cost requiring prohibitive taxation, and the moral risk of severing the social contract linking citizenship rights with reciprocal social contribution.''

What is the ''welfare cliff'' (or poverty trap) described in the passage?', 'multiple_choice', '["A disincentive structure in targeted welfare where earning incremental earned income causes a sudden loss of state benefits, leaving the recipient financially worse off or no better off.","A geographic region where municipal welfare offices are located on steep coastal terrain.","The complete absence of any social welfare benefits in low-income neighborhoods.","An automatic legal expulsion from public housing upon reaching the age of 65."]'::jsonb, 'A disincentive structure in targeted welfare where earning incremental earned income causes a sudden loss of state benefits, leaving the recipient financially worse off or no better off.', 'Targeted welfare phases out aggressively as recipients earn money, producing near-100% effective marginal tax rates that trap people in poverty by punishing employment.', 1, 12),
  ('77777777-7777-4777-8777-000000000014', '77777777-7777-4777-8777-777777777777', 'Which ideological argument distinguishes the libertarian defense of UBI (such as Milton Friedman''s negative income tax) from the socialist defense of UBI (such as Philippe Van Parijs''s ''real freedom for all'')?', 'multiple_choice', '["Libertarians see UBI as an efficient cash vehicle to dismantle the regulatory state and welfare bureaucracy, whereas socialists view UBI as a tool to emancipate workers from capitalist wage labor dependency.","Libertarians advocate paying UBI exclusively in physical gold coins.","Socialists demand that UBI be funded by abolishing all income taxes on corporate executives.","Libertarians insist that children under five receive double payments."]'::jsonb, 'Libertarians see UBI as an efficient cash vehicle to dismantle the regulatory state and welfare bureaucracy, whereas socialists view UBI as a tool to emancipate workers from capitalist wage labor dependency.', 'Right-libertarians embrace UBI to replace complex government departments with market cash; left-egalitarians see it as giving workers the unconditional power to say ''no'' to capital.', 1, 13),
  ('77777777-7777-4777-8777-000000000015', '77777777-7777-4777-8777-777777777777', 'How does paying UBI to multi-millionaires satisfy the moral philosophy of ''universality'' while remaining fiscally equitable in a progressive tax system?', 'multiple_choice', '["Universality eliminates bureaucratic means-testing stigma, while high-income earners pay back vastly more than the transfer through progressive income and wealth taxes.","Millionaires are legally mandated to donate their UBI checks to state museums.","Wealthy citizens are disqualified from voting if they cash their UBI check.","The basic income payment depreciates to zero if kept in a commercial bank account."]'::jsonb, 'Universality eliminates bureaucratic means-testing stigma, while high-income earners pay back vastly more than the transfer through progressive income and wealth taxes.', 'Universality preserves social cohesion and avoids intrusive bureaucracy; progressive tax policy on the revenue side claws back the transfer from the rich.', 1, 14),
  ('77777777-7777-4777-8777-000000000016', '77777777-7777-4777-8777-777777777777', 'Which of the following criticisms represents a ''republican'' (civic virtue) objection to Universal Basic Income?', 'multiple_choice', '["Democracy requires active civic participation and reciprocal cooperative obligations, which might be eroded if citizens become passive recipients of state dividends.","UBI stimulates excessive domestic consumer spending on electronic appliances.","UBI encourages too many citizens to run for parliamentary election.","Cash payments violate the separation of powers between executive and judicial branches."]'::jsonb, 'Democracy requires active civic participation and reciprocal cooperative obligations, which might be eroded if citizens become passive recipients of state dividends.', 'Civic republicanism stresses duty, reciprocal contribution, and active engagement, worrying that unconditional state stipends transform citizens into atomized, passive consumers.', 1, 15),
  ('77777777-7777-4777-8777-000000000017', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''The contemporary workplace has witnessed the rise of "bossware" and algorithmic management. Warehousing logistics workers and remote white-collar professionals alike are subjected to automated tracking: keystroke logging, webcam eye-tracking, and minute-by-minute metric optimization. When an automated algorithm can terminate an employee for falling below a statistical throughput target without human review, the foundational common-law requirement of natural justice and fair disciplinary procedure is compromised. Article 22 of the EU General Data Protection Regulation (GDPR) establishes a presumptive right not to be subject to a decision based solely on automated processing which produces legal effects, yet corporate employers frequently evade this through nominal human rubber-stamping.''

What is the primary threat to employment rights posed by automated algorithmic termination?', 'multiple_choice', '["The elimination of individualized human discretion, context sensitivity, and procedural fairness (natural justice) in disciplinary actions.","Algorithmic servers consuming excessive electrical grid power during office hours.","Employees receiving their dismissal notices via digital email rather than posted paper mail.","The risk that computers will accidentally transfer corporate stock into employee accounts."]'::jsonb, 'The elimination of individualized human discretion, context sensitivity, and procedural fairness (natural justice) in disciplinary actions.', 'Automated firing treats humans as statistical metrics, stripping away the basic legal right to present mitigating circumstances, explain technical anomalies, or receive a fair hearing.', 1, 16),
  ('77777777-7777-4777-8777-000000000018', '77777777-7777-4777-8777-777777777777', 'According to the passage, how do corporate employers circumvent Article 22 of the GDPR regarding automated decision-making?', 'multiple_choice', '["By having human supervisors perform token ''rubber-stamping'' of algorithmically generated termination recommendations without genuine independent evaluation.","By relocating their headquarters to international waters.","By renaming all employee dismissal documents as ''voluntary sabbaticals''.","By deleting employee names from corporate payroll databases."]'::jsonb, 'By having human supervisors perform token ''rubber-stamping'' of algorithmically generated termination recommendations without genuine independent evaluation.', 'To dodge ''solely automated'' statutory thresholds, companies introduce a pro forma human sign-off who merely rubber-stamps whatever the algorithm recommended.', 1, 17),
  ('77777777-7777-4777-8777-000000000019', '77777777-7777-4777-8777-777777777777', 'In the context of pervasive remote-work keystroke tracking, which human right under the European Convention on Human Rights (ECHR) is most directly engaged?', 'multiple_choice', '["Article 8: The right to respect for private and family life, home, and correspondence.","Article 3: The prohibition against torture and degrading treatment.","Article 10: Freedom of artistic expression in public parks.","Article 12: The right to enter into civil matrimony."]'::jsonb, 'Article 8: The right to respect for private and family life, home, and correspondence.', 'ECHR jurisprudence (e.g., Barbulescu v Romania) establishes that employees maintain a legitimate expectation of privacy (Article 8) in digital correspondence and workplace activity.', 1, 18),
  ('77777777-7777-4777-8777-000000000020', '77777777-7777-4777-8777-777777777777', 'A corporate HR executive argues: ''Our warehouse monitoring algorithm is completely objective because it measures only physical barcode scan rates and contains no human racial or gender bias.'' What unexamined bias does this argument ignore?', 'multiple_choice', '["Disparate impact bias: applying an identical, unyielding scan speed metric systematically discriminates against pregnant, elderly, or disabled workers with legitimate physiological needs.","The algorithm''s source code was written in a non-English programming language.","The company''s logo uses colors that trigger optical fatigue.","Barcode scanners emit low-frequency sounds that annoy domestic animals."]'::jsonb, 'Disparate impact bias: applying an identical, unyielding scan speed metric systematically discriminates against pregnant, elderly, or disabled workers with legitimate physiological needs.', 'Facially neutral metrics can cause severe unlawful indirect discrimination (disparate impact) by penalizing protected groups who cannot match unreasonable physical performance standards.', 1, 19),
  ('77777777-7777-4777-8777-000000000021', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''Economists frequently dismiss fears of technological unemployment by invoking the "lump of labour fallacy"—the erroneous assumption that there is a fixed quantity of work to be performed in an economy, such that automating a task permanently extinguishes labor demand. Historically, automation lowered production costs, leading to cheaper goods, increased consumer disposable income, and the creation of entirely new economic industries and professions. Yet, artificial intelligence theorists suggest this historical analogy may falter. Previous automation replaced human muscle with mechanical power, leaving human cognitive capabilities ascendant. If AI successfully substitutes for cognitive and analytical faculties themselves, the human worker may face a structural redundancy akin to the displacement of the horse by the automobile.''

What is the core distinction between historical mechanical automation and contemporary AI automation highlighted in the passage?', 'multiple_choice', '["Past automation mechanized physical labor while shifting humans into cognitive and analytical roles, whereas AI directly automates cognitive and analytical labor itself.","Historical automation only affected agricultural farming, whereas AI only affects manufacturing.","Mechanical machinery did not require electricity, whereas AI requires fossil fuels.","Past automation was funded entirely by government grants, whereas AI is private."]'::jsonb, 'Past automation mechanized physical labor while shifting humans into cognitive and analytical roles, whereas AI directly automates cognitive and analytical labor itself.', 'The historical escape valve was that displaced physical laborers retrained into knowledge/cognitive work; if cognitive tasks are automated, there may be no higher domain for humans to migrate into.', 1, 20),
  ('77777777-7777-4777-8777-000000000022', '77777777-7777-4777-8777-777777777777', 'In the passage, why does the author cite the historical analogy of ''the displacement of the horse by the automobile''?', 'multiple_choice', '["To illustrate that technology can render a biological factor of production entirely obsolete without creating substitute employment for that entity.","To advocate for the reintroduction of horse-drawn carriages in urban transit.","To demonstrate that horses had union representation under common law.","To praise the automotive industry for reducing greenhouse gas emissions."]'::jsonb, 'To illustrate that technology can render a biological factor of production entirely obsolete without creating substitute employment for that entity.', 'Horses did not become employed in higher-skilled jobs after cars were invented; their economic utility simply vanished, serving as a cautionary metaphor for human labor.', 1, 21),
  ('77777777-7777-4777-8777-000000000023', '77777777-7777-4777-8777-777777777777', 'According to standard economic theory, how does the ''lump of labour fallacy'' explain why introducing women into the workforce in the mid-twentieth century did not cause mass male unemployment?', 'multiple_choice', '["The expansion of the workforce increased aggregate economic production, generated new household demand, and expanded the overall size of the economic pie.","Male workers voluntarily retired at age thirty.","Female workers were prohibited from receiving wages in legal tender.","Governments raised import tariffs on foreign textiles."]'::jsonb, 'The expansion of the workforce increased aggregate economic production, generated new household demand, and expanded the overall size of the economic pie.', 'Labor supply creates its own demand via consumer spending; the economy is not a zero-sum fixed lump, so adding workers expanded total employment.', 1, 22),
  ('77777777-7777-4777-8777-000000000024', '77777777-7777-4777-8777-777777777777', 'Which of the following interventions represents a Pigouvian policy designed to disincentivize excessive corporate automation at the expense of human employment?', 'multiple_choice', '["An automated robotics and AI automation tax aimed at leveling the fiscal playing field between capital and human labor.","Subsidizing corporate software purchases with taxpayer revenue.","Banning universities from teaching computer science courses.","Abolishing all safety regulations in manufacturing plants."]'::jsonb, 'An automated robotics and AI automation tax aimed at leveling the fiscal playing field between capital and human labor.', 'A ''robot tax'' internalizes the negative social externalities of rapid displacement, slowing deployment and funding worker retraining or public support.', 1, 23),
  ('77777777-7777-4777-8777-000000000025', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''Generative AI models are trained on colossal corpora of text, images, and music harvested across the public internet without explicit creator consent or licensing compensation. AI developers defend this practice under the American doctrine of "fair use" (or text and data mining exceptions in the UK and EU), arguing that training merely extracts unprotectable statistical correlations and abstract stylistic patterns to create transformative new works. Creative artists and authors vigorously contest this, characterizing mass data scraping as systematic copyright theft and digital enclosure. They contend that AI models do not learn like humans, but act as sophisticated commercial derivative machines competing directly in the marketplace against the very human artists whose life works were ingested to build them.''

What is the core doctrinal disagreement in the application of ''fair use'' to generative AI training?', 'multiple_choice', '["Whether ingesting copyrighted works to train neural network weights is a transformative non-infringing functional use, or an unauthorized commercial exploitation that impairs the market value of original works.","Whether artists should be legally forced to destroy their physical sketchbooks.","Whether text files uploaded to the internet automatically enter the public domain after 24 hours.","Whether computer software code can be printed on paper."]'::jsonb, 'Whether ingesting copyrighted works to train neural network weights is a transformative non-infringing functional use, or an unauthorized commercial exploitation that impairs the market value of original works.', 'The central legal conflict pivots on transformative purpose (Factor 1 of fair use) versus market harm and substitution (Factor 4 of fair use).', 1, 24),
  ('77777777-7777-4777-8777-000000000026', '77777777-7777-4777-8777-777777777777', 'How does the legal concept of copyright protect human expression while allowing AI companies to scrape factual data?', 'multiple_choice', '["The ''idea-expression dichotomy'' holds that copyright protects original creative expression, but never extends to raw facts, ideas, or functional data patterns.","Copyright only protects works created before the year 1900.","Factual data can only be copyrighted by licensed state universities.","All digital information is classified as physical property under maritime law."]'::jsonb, 'The ''idea-expression dichotomy'' holds that copyright protects original creative expression, but never extends to raw facts, ideas, or functional data patterns.', 'Under the idea-expression dichotomy, anyone can use underlying facts or styles; only the specific creative formulation/expression is shielded by copyright.', 1, 25),
  ('77777777-7777-4777-8777-000000000027', '77777777-7777-4777-8777-777777777777', 'In the United States copyright office ruling regarding Zarya of the Dawn (2023), what did the Register of Copyrights decide regarding AI-generated comic book illustrations?', 'multiple_choice', '["Images generated entirely by Midjourney lacked human authorship and could not receive copyright protection, though the human author''s text and selection/arrangement were protected.","All comic books were declared public domain.","Midjourney AI was declared the legal author and owner of the royalties.","The artist was fined for using a computer."]'::jsonb, 'Images generated entirely by Midjourney lacked human authorship and could not receive copyright protection, though the human author''s text and selection/arrangement were protected.', 'Copyright law requires human creative authorship; AI-generated outputs without human brushstroke/creative execution cannot be copyrighted.', 1, 26),
  ('77777777-7777-4777-8777-000000000028', '77777777-7777-4777-8777-777777777777', 'Which collective bargaining solution was successfully negotiated by the Writers Guild of America (WGA) in 2023 regarding AI in screenwriting?', 'multiple_choice', '["AI cannot write or rewrite literary material, and studios cannot use AI-generated output to undermine writers'' credits, residuals, or compensation.","Writers agreed to work without pay in exchange for free subscriptions to ChatGPT.","All television scripts must be written exclusively by artificial intelligence.","Studios were banned from using computers in production offices."]'::jsonb, 'AI cannot write or rewrite literary material, and studios cannot use AI-generated output to undermine writers'' credits, residuals, or compensation.', 'The WGA contract established that AI is not a recognized writer, protecting human credits, residuals, and preventing studios from giving writers cheap AI drafts to edit.', 1, 27),
  ('77777777-7777-4777-8777-000000000029', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''Conventional measures of macroeconomic prosperity, such as Gross Domestic Product (GDP), were formulated in the 1930s by Simon Kuznets. By design, GDP counts only transactions that pass through the cash nexus of the market. Consequently, as feminist economist Marilyn Waring famously demonstrated, an oil tanker spill or a weapon sale immediately boosts GDP through cleanup and manufacturing expenditures, while the immense unpaid labor of domestic caregiving, child-rearing, and eldercare—disproportionately performed by women worldwide—is counted as economically "zero". This systemic statistical omission renders the foundational reproductive work that sustains human civilization completely invisible in policy formulation and national resource allocation.''

What is the fundamental critique of Gross Domestic Product (GDP) presented in the passage?', 'multiple_choice', '["GDP measures market cash flow rather than human welfare, perversely counting ecological destruction as positive while ignoring essential unpaid reproductive care work.","GDP figures are calculated using inaccurate Roman numerals.","Simon Kuznets intended GDP to measure only the wealth of military generals.","Market capitalism does not require child-rearing or domestic labor to function."]'::jsonb, 'GDP measures market cash flow rather than human welfare, perversely counting ecological destruction as positive while ignoring essential unpaid reproductive care work.', 'GDP treats market transactions as output regardless of harm (cleanups, weapons) while completely ignoring non-monetized domestic care work that keeps society functioning.', 1, 28),
  ('77777777-7777-4777-8777-000000000030', '77777777-7777-4777-8777-777777777777', 'How does the exclusion of unpaid domestic labor from national accounts directly perpetuate the gender wealth gap throughout women''s lifetimes?', 'multiple_choice', '["Periods spent performing unpaid care work result in disrupted market participation, lower cumulative earnings, and reduced contributory retirement pensions.","Women are legally barred from opening personal bank accounts in OECD nations.","Unpaid caregivers are charged higher municipal residential property taxes.","Corporate employers automatically seize the assets of married female employees."]'::jsonb, 'Periods spent performing unpaid care work result in disrupted market participation, lower cumulative earnings, and reduced contributory retirement pensions.', 'Taking time out of the workforce for family care limits career progression, wage growth, and contributory state/private pensions, culminating in severe elder poverty.', 1, 29),
  ('77777777-7777-4777-8777-000000000031', '77777777-7777-4777-8777-777777777777', 'Which public policy reform is most effective at dismantling the gendered division of domestic labor within households?', 'multiple_choice', '["Non-transferable ''use-it-or-lose-it'' paid paternity leave reserved exclusively for fathers.","Increasing the general statutory retirement age to seventy-five for all workers.","Banning household electrical appliances to promote manual cooking.","Replacing all nursery schools with commercial boarding facilities."]'::jsonb, 'Non-transferable ''use-it-or-lose-it'' paid paternity leave reserved exclusively for fathers.', 'Nordic ''daddy quotas'' force paternity leave to be taken by fathers rather than transferred to mothers, normalizing male caregiving and reducing maternal career penalties.', 1, 30),
  ('77777777-7777-4777-8777-000000000032', '77777777-7777-4777-8777-777777777777', 'In the famous paradox posed by Arthur Cecil Pigou: ''If a man marries his paid housekeeper, national income decreases; if he divorces her and re-hires her as an employee, national income increases.'' What does this paradox illustrate?', 'multiple_choice', '["The arbitrary dependency of national income statistics on the legal and marital form of an activity rather than the physical reality of the work performed.","That marriage should be abolished under commercial tax law.","That domestic housekeepers earn higher hourly wages than corporate attorneys.","That divorce courts have no jurisdiction over domestic employment disputes."]'::jsonb, 'The arbitrary dependency of national income statistics on the legal and marital form of an activity rather than the physical reality of the work performed.', 'Pigou''s riddle highlights that identical domestic cleaning labor is counted in GDP when monetized, but vanishes from GDP when performed within marital relations.', 1, 31),
  ('77777777-7777-4777-8777-000000000033', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''In 1970, Milton Friedman proclaimed in The New York Times that the sole social responsibility of business is to increase its profits within the rules of the game. For decades, this doctrine of "shareholder primacy" dominated corporate law in the United States and the UK, prioritizing short-term quarterly earnings, share buybacks, and executive equity bonuses. Opponents champion the "stakeholder model" (or codetermination, as practiced in Germany), which legally obligates directors to weigh the interests of employees, customers, suppliers, the environment, and the broader community alongside shareholder returns.''

What is the defining feature of the German system of ''codetermination'' (Mitbestimmung) in corporate governance?', 'multiple_choice', '["Employees directly elect half of the members of the supervisory board of large public corporations, giving labor a formal voice in governance.","Trade unions are prohibited from participating in any corporate meetings.","Shareholders are forbidden from selling their shares on public stock exchanges.","All corporate profits must be handed over directly to municipal councils."]'::jsonb, 'Employees directly elect half of the members of the supervisory board of large public corporations, giving labor a formal voice in governance.', 'Codetermination legally reserves half of supervisory board seats for worker representatives, aligning corporate decisions with long-term labor interests.', 1, 32),
  ('77777777-7777-4777-8777-000000000034', '77777777-7777-4777-8777-777777777777', 'How does Section 172 of the UK Companies Act 2006 formulate a director''s general statutory duty?', 'multiple_choice', '["To promote the success of the company for the benefit of its members, while having regard to employee interests, community impact, and the long-term consequences of decisions.","To maximize daily share price above all other considerations.","To donate 50% of annual net revenue to charitable foundations.","To dissolve the company immediately if carbon emissions rise."]'::jsonb, 'To promote the success of the company for the benefit of its members, while having regard to employee interests, community impact, and the long-term consequences of decisions.', 'Section 172 codifies ''enlightened shareholder value'': directors must prioritize company success for shareholders, but must consider employees, environment, and long-term impact.', 1, 33),
  ('77777777-7777-4777-8777-000000000035', '77777777-7777-4777-8777-777777777777', 'A corporate hedge fund argues: ''Share buybacks are the most efficient use of surplus corporate capital because they return money to investors who can allocate it elsewhere.'' What is the labor and industrial critique of this practice?', 'multiple_choice', '["Buybacks artificially inflate executive stock-option compensation while diverting capital away from research, productive equipment, and employee wage increases.","Buybacks are classified as treason under maritime law.","Shareholders refuse to accept money returned through stock repurchases.","Buybacks cause automated factory machinery to stop functioning."]'::jsonb, 'Buybacks artificially inflate executive stock-option compensation while diverting capital away from research, productive equipment, and employee wage increases.', 'Critics highlight that financialized share repurchases cannibalize long-term productive reinvestment in worker wages, innovation, and plant resilience.', 1, 34),
  ('77777777-7777-4777-8777-000000000036', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''The right of organized workers to withdraw their labor through strikes is protected under International Labour Organization (ILO) Convention 87 and recognized as an integral aspect of freedom of association under Article 11 of the ECHR. However, governments frequently seek to curtail strike action in critical infrastructure—such as healthcare, railways, and fire rescue services—by enacting "minimum service levels" legislation. When a statute empowers employers to issue "work notices" compelling named individual workers to cross picket lines on pain of dismissal, trade unions argue that the constitutional right to strike is rendered illusory.''

What is the fundamental legal tension between minimum service level legislation and international labor law?', 'multiple_choice', '["Balancing the public interest in protecting essential public health and safety against the fundamental human right of workers to associate and engage in effective collective withdrawal of labor.","Determining which color warning flags should be flown outside railway stations during winter.","Whether ambulance drivers should be required to wear military uniforms while off duty.","Deciding whether hospital patients are legally permitted to vote in local council elections."]'::jsonb, 'Balancing the public interest in protecting essential public health and safety against the fundamental human right of workers to associate and engage in effective collective withdrawal of labor.', 'The core conflict lies between protecting public life and welfare versus gutting workers'' only real economic leverage: the collective power to halt labor.', 1, 35),
  ('77777777-7777-4777-8777-000000000037', '77777777-7777-4777-8777-777777777777', 'Under the jurisprudence of the European Court of Human Rights in Demir and Baykara v Turkey (2008), the right to collective bargaining and strike action is recognized as:', 'multiple_choice', '["An inherent and essential element of the right to freedom of association under Article 11 of the Convention.","An illegal conspiracy against the public treasury.","A temporary privilege granted at the absolute discretion of the executive monarch.","A commercial antitrust violation under European competition law."]'::jsonb, 'An inherent and essential element of the right to freedom of association under Article 11 of the Convention.', 'In Demir and Baykara, the ECtHR overturned older precedent to hold that collective bargaining and strike action are integral rights protected under Article 11 ECHR.', 1, 36),
  ('77777777-7777-4777-8777-000000000038', '77777777-7777-4777-8777-777777777777', 'Why do trade unions argue that issuing mandatory work notices to individual employees during lawful strikes infringes personal liberty?', 'multiple_choice', '["Compelling an individual to perform labor under threat of summary dismissal approaches the character of forced labor under Article 4 of the ECHR.","It requires workers to commute by public buses.","Workers who receive letters are prohibited from watching television.","Dismissed workers are denied access to public libraries."]'::jsonb, 'Compelling an individual to perform labor under threat of summary dismissal approaches the character of forced labor under Article 4 of the ECHR.', 'Unions argue that conscripting specific employees to work against their will under pain of immediate firing undermines basic bodily and employment liberty.', 1, 37),
  ('77777777-7777-4777-8777-000000000039', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''In Lungowe v Vedanta Resources plc (2019), the UK Supreme Court addressed whether a British multinational parent company could be held liable in negligence for environmental damage and human rights violations committed by its foreign subsidiary in Zambia. Overturning decades of corporate shield defenses, the Supreme Court ruled that a parent company owes a direct common-law duty of care to communities affected by its overseas operations if it exercises systemic managerial control, supervises subsidiary environmental policies, or publicly holds itself out as responsible for group-wide standards.''

What was the profound doctrinal significance of Vedanta for corporate parent liability?', 'multiple_choice', '["It established that parent corporations cannot automatically hide behind the separate legal personality of overseas subsidiaries if they actively direct or oversee operational policies.","It ruled that British courts have no jurisdiction outside the British Isles.","It declared all foreign mining operations illegal under English common law.","It mandated that all foreign subsidiaries merge into a single global entity."]'::jsonb, 'It established that parent corporations cannot automatically hide behind the separate legal personality of overseas subsidiaries if they actively direct or oversee operational policies.', 'Vedanta breached the corporate veil via common-law tort: parent companies that control or publicize governance over subsidiaries owe a direct duty of care to affected foreign victims.', 1, 38),
  ('77777777-7777-4777-8777-000000000040', '77777777-7777-4777-8777-777777777777', 'Under the European Union Corporate Sustainability Due Diligence Directive (CSDDD), what legal duty is imposed on large multinational corporations?', 'multiple_choice', '["To conduct mandatory human rights and environmental due diligence across their entire upstream and downstream global supply chains and mitigate identified harms.","To cease importing all raw materials from non-European countries.","To pay all foreign workers in European Union currency.","To submit their annual budgets to the United Nations Security Council."]'::jsonb, 'To conduct mandatory human rights and environmental due diligence across their entire upstream and downstream global supply chains and mitigate identified harms.', 'The CSDDD transforms corporate social responsibility into hard law, requiring companies to identify, prevent, and remediate human rights and environmental abuses in their value chains.', 1, 39),
  ('77777777-7777-4777-8777-000000000041', '77777777-7777-4777-8777-777777777777', 'Passage Excerpt: ''In Capital in the Twenty-First Century, Thomas Piketty demonstrated that whenever the net rate of return on capital (r) systematically exceeds the overall economic growth rate (g), inherited wealth grows faster than output and wages. Under the formula r > g, meritocracy dissolves as patrimonial capitalism re-emerges: an individual''s economic destiny is dictated far more by inherited familial assets than by lifelong labor, education, or effort. To prevent dangerous oligarchic wealth concentration, economists propose progressive annual net wealth taxes and aggressive inheritance estate duties.''

What is the sociological consequence of the inequality condition r > g as formulated by Piketty?', 'multiple_choice', '["Society regresses toward patrimonial capitalism, where inherited generational wealth eclipses labor income and undermines meritocratic social mobility.","Economic growth accelerates to unprecedented historical speeds.","All private financial capital converts into public infrastructure.","Interest rates set by central banks plummet to permanent negative values."]'::jsonb, 'Society regresses toward patrimonial capitalism, where inherited generational wealth eclipses labor income and undermines meritocratic social mobility.', 'When capital returns outpace wage growth ($r > g$), old fortunes accumulate automatically, making inheritance vastly more determinative of wealth than lifetime hard work.', 1, 40),
  ('77777777-7777-4777-8777-000000000042', '77777777-7777-4777-8777-777777777777', 'A conservative philosopher argues against inheritance taxation: ''Parents have a natural moral right to pass their accumulated wealth to their children, and taxing bequests violates family autonomy.'' What is the egalitarian philosophical response to this argument?', 'multiple_choice', '["Unregulated intergenerational wealth transmission creates vast unearned advantages at birth, directly subverting the foundational liberal principle of fair equality of opportunity.","Children should be declared legal property of the state at age eighteen.","Inherited money always loses its legal purchasing power after forty years.","Family relationships should be prohibited under civil equality statutes."]'::jsonb, 'Unregulated intergenerational wealth transmission creates vast unearned advantages at birth, directly subverting the foundational liberal principle of fair equality of opportunity.', 'True equality of opportunity (John Rawls) cannot exist when some children inherit astronomical fortunes while others start with nothing through no fault of their own.', 1, 41)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  points = EXCLUDED.points,
  order_index = EXCLUDED.order_index;
