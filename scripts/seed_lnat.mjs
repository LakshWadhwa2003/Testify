import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

function getEnvVar(name) {
  const match = envContent.match(new RegExp(`${name}\\s*=\\s*(.*)`));
  return match ? match[1].trim() : process.env[name] || '';
}

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const serviceRoleKey = process.argv[2] || getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or Key in .env!');
  process.exit(1);
}

console.log('Connecting to Supabase:', supabaseUrl);
console.log('Using Key type:', serviceRoleKey.startsWith('sb_publishable') || serviceRoleKey.length < 100 ? 'Anon/Publishable' : 'Service Role / JWT');

const supabase = createClient(supabaseUrl, serviceRoleKey);

export const LNAT_TESTS = [
  {
    "id": "11111111-1111-4111-8111-111111111111",
    "title": "LNAT Paper 1: Medical Ethics & Patient Autonomy",
    "description": "Based on William Ruddick's seminal passage from official LNAT Practice Test 1 and contemporary bioethics. Focuses on paternalism, informed consent, therapeutic privilege, mental capacity, assisted dying, and clinical resource allocation.",
    "duration_minutes": 95,
    "total_points": 42,
    "is_published": true,
    "category": "LNAT - Critical Reasoning"
  },
  {
    "id": "22222222-2222-4222-8222-222222222222",
    "title": "LNAT Paper 2: Constitutional Law & State Neutrality",
    "description": "Adapted from official LNAT Practice Test 1 (Passage 2) and constitutional jurisprudence. Examines civil service neutrality, parliamentary sovereignty, separation of powers, judicial review, emergency executive prerogatives, and civil liberties.",
    "duration_minutes": 95,
    "total_points": 42,
    "is_published": true,
    "category": "LNAT - Critical Reasoning"
  },
  {
    "id": "33333333-3333-4333-8333-333333333333",
    "title": "LNAT Paper 3: Digital Epistemology & Education",
    "description": "Based on official LNAT Practice Test 1 (Passage 4) and digital philosophy. Explores search engines vs deep scholarship, epistemic filter bubbles, generative AI in academia, cognitive offloading, open access paywalls, and student privacy.",
    "duration_minutes": 95,
    "total_points": 42,
    "is_published": true,
    "category": "LNAT - Critical Reasoning"
  },
  {
    "id": "44444444-4444-4444-8444-444444444444",
    "title": "LNAT Paper 4: Literary Theory & Aesthetic Value",
    "description": "Adapted from official LNAT Practice Test 2 (Passage 1) and aesthetic philosophy. Focuses on the intentional fallacy, aesthetic objectivity vs relativism, the literary canon, cultural repatriation of artifacts, and artificial intelligence in creative arts.",
    "duration_minutes": 95,
    "total_points": 42,
    "is_published": true,
    "category": "LNAT - Critical Reasoning"
  },
  {
    "id": "55555555-5555-4555-8555-555555555555",
    "title": "LNAT Paper 5: Climate Policy & Economic Realism",
    "description": "Derived from official LNAT Practice Test 2 and environmental economics. Analyzes market instruments vs regulation, intergenerational discount rates, green growth vs degrowth, climate justice, rights-of-nature litigation, and energy security.",
    "duration_minutes": 95,
    "total_points": 42,
    "is_published": true,
    "category": "LNAT - Critical Reasoning"
  }
,
  {
  "id": "66666666-6666-4666-8666-666666666666",
  "title": "LNAT Paper 6: Cognitive Psychology, Eyewitness Memory & Judicial Proof",
  "description": "Adapted from official LNAT Practice Test 2 (Passage 3: On Memory by Michel de Montaigne) and legal epistemology. Explores the fallibility of human memory, eyewitness identification reliability, presumption of innocence, cognitive bias in forensic testimony, and standards of proof in common-law criminal jurisprudence.",
  "duration_minutes": 95,
  "total_points": 42,
  "is_published": true,
  "category": "LNAT - Critical Reasoning"
},
  {
  "id": "77777777-7777-4777-8777-777777777777",
  "title": "LNAT Paper 7: Automation, The Future of Work & Socio-Economic Rights",
  "description": "Derived from official LNAT Practice Test 2 (Passage 6: 'The Future of Work') and Practice Test 1 ('A Global Dilemma'). Investigates technological unemployment, gig-economy employment status, collective bargaining, universal basic income, algorithmic management, and socio-economic rights in modern jurisprudence.",
  "duration_minutes": 95,
  "total_points": 42,
  "is_published": true,
  "category": "LNAT - Critical Reasoning"
}
];

export const LNAT_QUESTIONS = [
  {
    "id": "11111111-1111-4111-8111-000000000001",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'For centuries, Western medical practice rested on the benevolent paternalism codified in the Hippocratic Oath, wherein the physician pledged to act solely according to their judgment for the benefit of the sick. However, modern jurisprudence and bioethics have inverted this hierarchy, establishing that the mentally competent patient possesses an inviolable right to determine what shall be done with their own body.'\n\nAccording to the passage's analysis of traditional versus modern medical ethics, which of the following best represents the fundamental reason why medical paternalism has been increasingly challenged in modern law and philosophy?",
    "question_type": "multiple_choice",
    "options": [
      "Modern medical treatments are significantly less risky than historical remedies, reducing the physician's moral burden.",
      "Legal and philosophical principles now prioritize an individual's inviolable right to self-determination over a physician's unilateral assessment of well-being.",
      "Doctors no longer take any ethical oath upon completing their clinical training.",
      "Patients today generally possess greater diagnostic expertise than professional healthcare providers."
    ],
    "correct_answer": "Legal and philosophical principles now prioritize an individual's inviolable right to self-determination over a physician's unilateral assessment of well-being.",
    "explanation": "Modern biomedical jurisprudence holds that competent adults have an inviolable right to bodily autonomy and informed consent, meaning a physician cannot impose treatment merely because they believe it is beneficial.",
    "points": 1,
    "order_index": 0
  },
  {
    "id": "11111111-1111-4111-8111-000000000002",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following statements represents an empirical assertion of fact rather than a normative ethical value judgment?",
    "question_type": "multiple_choice",
    "options": [
      "Physicians ought never to withhold pertinent diagnostic facts from mentally competent patients.",
      "Modern healthcare delivery increasingly operates within multidisciplinary hospital teams rather than solitary doctor-patient relationships.",
      "Beneficence is morally subordinate to autonomy when resolving clinical dilemmas.",
      "Concealing a terminal prognosis is an unconscionable betrayal of human dignity."
    ],
    "correct_answer": "Modern healthcare delivery increasingly operates within multidisciplinary hospital teams rather than solitary doctor-patient relationships.",
    "explanation": "This is a descriptive, empirical statement regarding the organizational reality of modern clinical practice. The other options contain normative terms ('ought never', 'morally subordinate', 'unconscionable').",
    "points": 1,
    "order_index": 1
  },
  {
    "id": "11111111-1111-4111-8111-000000000003",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'The legal doctrine of therapeutic privilege permits a physician to withhold diagnostic or prognostic information if disclosure would pose a serious psychological threat to the patient's health.'\n\nThe author's critique of 'therapeutic privilege' relies most heavily on which unstated assumption?",
    "question_type": "multiple_choice",
    "options": [
      "Patients rarely experience psychological distress upon receiving serious medical diagnoses.",
      "The potential harm of being denied self-determination generally outweighs the emotional discomfort caused by hearing distressing truths.",
      "Physicians deliberately exploit therapeutic privilege solely to avoid difficult conversations.",
      "Statutory regulations governing therapeutic privilege have been completely repealed in all common-law jurisdictions."
    ],
    "correct_answer": "The potential harm of being denied self-determination generally outweighs the emotional discomfort caused by hearing distressing truths.",
    "explanation": "To reject therapeutic privilege, the critic must assume that preserving patient autonomy and control over one's life is more important than avoiding emotional distress.",
    "points": 1,
    "order_index": 2
  },
  {
    "id": "11111111-1111-4111-8111-000000000004",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following findings, if true, would most strongly support the argument advocating for comprehensive diagnostic transparency over paternalistic non-disclosure?",
    "question_type": "multiple_choice",
    "options": [
      "Clinical studies showing that patients given full, transparent disclosures demonstrate higher treatment adherence and improved long-term coping mechanisms.",
      "Surveys showing that most doctors prefer not delivering fatal prognoses to elderly patients.",
      "Reports indicating that malpractice litigation rates against healthcare trusts have steadily risen over the past decade.",
      "Evidence showing that pharmaceutical manufacturers heavily sponsor medical education seminars."
    ],
    "correct_answer": "Clinical studies showing that patients given full, transparent disclosures demonstrate higher treatment adherence and improved long-term coping mechanisms.",
    "explanation": "This empirical evidence directly refutes the paternalistic defense that withholding information preserves patient health, showing instead that full disclosure yields superior clinical outcomes.",
    "points": 1,
    "order_index": 3
  },
  {
    "id": "11111111-1111-4111-8111-000000000005",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'In the landmark case of Montgomery v Lanarkshire Health Board (2015), the UK Supreme Court departed from the physician-centric Bolam standard. The court ruled that doctors must disclose any material risk to which a reasonable person in the patient's position would attach significance.'\n\nWhat is the primary conceptual shift marked by the Montgomery ruling regarding medical disclosure?",
    "question_type": "multiple_choice",
    "options": [
      "It transfers the definition of acceptable risk from the consensus of medical peers to the expectations of the reasonable patient.",
      "It requires doctors to eliminate all risks before proceeding with elective surgical procedures.",
      "It forbids physicians from recommending their preferred clinical treatment options.",
      "It makes patients legally liable for unforeseen complications if they signed a consent waiver."
    ],
    "correct_answer": "It transfers the definition of acceptable risk from the consensus of medical peers to the expectations of the reasonable patient.",
    "explanation": "The Montgomery ruling shifted the legal benchmark away from what a responsible body of medical professionals would disclose (the Bolam test) to what a reasonable patient would consider significant.",
    "points": 1,
    "order_index": 4
  },
  {
    "id": "11111111-1111-4111-8111-000000000006",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Suppose a surgeon fails to disclose a 1% risk of permanent vocal cord paralysis during routine thyroid surgery. The patient suffers the paralysis. Under the Montgomery standard, which fact is most critical to establishing medical negligence?",
    "question_type": "multiple_choice",
    "options": [
      "Whether other surgeons in the hospital routinely perform thyroid surgery without complications.",
      "Whether the surgeon was exhausted at the time of the operation.",
      "Whether this particular patient, to the surgeon's knowledge, was a professional opera singer whose livelihood depended entirely on voice preservation.",
      "Whether the cost of the surgical procedure was subsidized by state healthcare funding."
    ],
    "correct_answer": "Whether this particular patient, to the surgeon's knowledge, was a professional opera singer whose livelihood depended entirely on voice preservation.",
    "explanation": "Montgomery requires disclosure of risks that a reasonable person in the patient's specific circumstances would attach significance to; for an opera singer, vocal cord paralysis is acutely material.",
    "points": 1,
    "order_index": 5
  },
  {
    "id": "11111111-1111-4111-8111-000000000007",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'Critics argue that demanding exhaustive disclosure of every negligible risk converts the therapeutic consultation into a defensive bureaucratic exercise, overwhelming vulnerable patients with incomprehensible statistical minutiae.'\n\nWhich of the following, if true, would best weaken this critique?",
    "question_type": "multiple_choice",
    "options": [
      "Patients who receive clear, structured risk discussions report feeling more empowered and less anxious about upcoming procedures.",
      "Hospitals have hired specialized administrative staff to oversee consent document processing.",
      "Doctors are already required to log electronic health records for billing compliance.",
      "Many patients sign consent documents without reading them thoroughly."
    ],
    "correct_answer": "Patients who receive clear, structured risk discussions report feeling more empowered and less anxious about upcoming procedures.",
    "explanation": "If structured risk discussions actually decrease anxiety and empower patients, it refutes the claim that disclosure merely overwhelms patients and serves defensive bureaucratic ends.",
    "points": 1,
    "order_index": 6
  },
  {
    "id": "11111111-1111-4111-8111-000000000008",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following scenarios best illustrates the legal concept of 'therapeutic privilege' being invoked legitimately under traditional common law?",
    "question_type": "multiple_choice",
    "options": [
      "A doctor conceals a surgical error to avoid being sued by the patient's relatives.",
      "A doctor temporarily withholds a terminal cancer diagnosis from an acutely suicidal patient in psychiatric crisis until psychological support is stabilized.",
      "A surgeon refuses to explain the side effects of anesthesia because explaining them would take too much clinic time.",
      "A clinician decides not to inform an unconscious patient's spouse about the patient's pre-existing illness."
    ],
    "correct_answer": "A doctor temporarily withholds a terminal cancer diagnosis from an acutely suicidal patient in psychiatric crisis until psychological support is stabilized.",
    "explanation": "Therapeutic privilege applies strictly when the physician reasonably believes disclosure would cause serious physical or mental harm, such as precipitating immediate suicide.",
    "points": 1,
    "order_index": 7
  },
  {
    "id": "11111111-1111-4111-8111-000000000009",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'Under the Mental Capacity Act 2005, an adult is presumed to have capacity unless established otherwise. Furthermore, a person is not to be treated as lacking capacity merely because they make an unwise decision.'\n\nWhat is the essential philosophical principle underlying the protection of 'unwise decisions' made by competent individuals?",
    "question_type": "multiple_choice",
    "options": [
      "That the state has no interest in public health preservation.",
      "That genuine autonomy includes the freedom to make choices that conflict with prevailing medical or social consensus.",
      "That physicians have no professional duty to advise patients against dangerous lifestyles.",
      "That objective medical truth does not exist in clinical diagnosis."
    ],
    "correct_answer": "That genuine autonomy includes the freedom to make choices that conflict with prevailing medical or social consensus.",
    "explanation": "Respect for autonomy implies that competent adults are entitled to align decisions with their personal values, even if those values lead to outcomes others deem foolish or catastrophic.",
    "points": 1,
    "order_index": 8
  },
  {
    "id": "11111111-1111-4111-8111-000000000010",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "In the case of Ms B (2002), a tetraplegic woman requested the withdrawal of mechanical ventilation keeping her alive. The NHS Trust contested her request, arguing she was clinically depressed. The High Court affirmed her right to refuse treatment. On what legal ground did the ruling primarily rest?",
    "question_type": "multiple_choice",
    "options": [
      "The court concluded that tetraplegia eliminates any reasonable quality of life.",
      "The court affirmed that a competent patient has an absolute right to refuse any medical treatment, even if that refusal results in death.",
      "The court held that mechanical ventilation is excessively costly for public health services.",
      "The court determined that the NHS Trust had failed to provide adequate rehabilitation therapies."
    ],
    "correct_answer": "The court affirmed that a competent patient has an absolute right to refuse any medical treatment, even if that refusal results in death.",
    "explanation": "Dame Elizabeth Butler-Sloss held that a mentally competent adult possesses the right to decline medical intervention, and continuing treatment against their competent will constitutes unlawful battery.",
    "points": 1,
    "order_index": 9
  },
  {
    "id": "11111111-1111-4111-8111-000000000011",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "A patient diagnosed with severe anorexia refuses nasogastric tube feeding, declaring that gaining weight is morally unacceptable to them. Why might a court declare this patient lacks capacity to refuse nutrition, despite their high cognitive intelligence?",
    "question_type": "multiple_choice",
    "options": [
      "Because anorexia is an expensive psychiatric disorder to manage in inpatient facilities.",
      "Because the compulsion of the eating disorder impairs their ability to weigh and use information regarding death and nutrition objectively.",
      "Because intelligent people are legally prohibited from refusing nourishment.",
      "Because nasogastric feeding carries no clinical risks whatsoever."
    ],
    "correct_answer": "Because the compulsion of the eating disorder impairs their ability to weigh and use information regarding death and nutrition objectively.",
    "explanation": "Capacity requires being able to understand, retain, and 'use or weigh' information. An obsessive pathological fear of weight gain can overpower the ability to weigh the reality of impending death.",
    "points": 1,
    "order_index": 10
  },
  {
    "id": "11111111-1111-4111-8111-000000000012",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following presents the most coherent philosophical tension within the doctrine of 'Advance Decisions to Refuse Treatment' (Living Wills)?",
    "question_type": "multiple_choice",
    "options": [
      "Advance directives are always hand-written, making them prone to physical damage.",
      "The healthy past person creating the directive may not anticipate the subjective coping adaptations of the future incapacitated person.",
      "Doctors are legally forbidden from consulting family members when a living will exists.",
      "Hospitals earn higher revenue by honoring living wills than by administering emergency care."
    ],
    "correct_answer": "The healthy past person creating the directive may not anticipate the subjective coping adaptations of the future incapacitated person.",
    "explanation": "Philosophers like Ronald Dworkin and Rebecca Dresser note that a healthy individual anticipating severe disability may underestimate the contentment and adapted desires of the later, altered self.",
    "points": 1,
    "order_index": 11
  },
  {
    "id": "11111111-1111-4111-8111-000000000013",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'Several nations have transitioned from an explicit opt-in organ donation framework to an opt-out (presumed consent) system, wherein all deceased citizens are regarded as prospective donors unless registered otherwise.'\n\nWhich of the following is a key moral premise necessary to justify presumed consent over explicit consent?",
    "question_type": "multiple_choice",
    "options": [
      "The human body automatically becomes municipal state property upon biological death.",
      "Default inertia should favor saving living human lives when the majority of citizens passively support donation but fail to register.",
      "Living relatives should never be consulted regarding organ retrieval procedures.",
      "Medical practitioners are ethically obliged to harvest organs whenever a patient enters cardiac arrest."
    ],
    "correct_answer": "Default inertia should favor saving living human lives when the majority of citizens passively support donation but fail to register.",
    "explanation": "Opt-out systems are justified on the behavioral insight that most people support donation in surveys; setting donation as the default harnesses cognitive inertia to maximize life-saving transplants.",
    "points": 1,
    "order_index": 12
  },
  {
    "id": "11111111-1111-4111-8111-000000000014",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "A libertarian philosopher opposes presumed consent on the grounds that non-action cannot be equated with affirmative consent. Which rebuttal most directly targets this objection?",
    "question_type": "multiple_choice",
    "options": [
      "The administrative costs of maintaining an opt-out registry are slightly lower than an opt-in registry.",
      "Citizens have ample opportunity and negligible friction to log an opt-out preference, making silent acquiescence a legitimate manifestation of choice.",
      "Kidney disease is currently the leading cause of premature mortality worldwide.",
      "Presumed consent laws were first tested in ancient Roman legal codes."
    ],
    "correct_answer": "Citizens have ample opportunity and negligible friction to log an opt-out preference, making silent acquiescence a legitimate manifestation of choice.",
    "explanation": "If the barrier to opting out is virtually zero and public awareness is ubiquitous, continuing not to opt out can reasonably be treated as tacit consent within a legitimate legal framework.",
    "points": 1,
    "order_index": 13
  },
  {
    "id": "11111111-1111-4111-8111-000000000015",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Suppose a state introduces a policy allowing financial compensation for living kidney donors. What is the most compelling ethical critique raised against commercializing organ procurement?",
    "question_type": "multiple_choice",
    "options": [
      "It would cause surgeons to forget their clinical training in nephrology.",
      "It disproportionately incentivizes impoverished individuals to undergo irreversible physiological risks, undermining genuinely voluntary consent.",
      "It would decrease the number of kidneys available for transplantation across public hospitals.",
      "It would violate the international copyright protections governing synthetic dialyzers."
    ],
    "correct_answer": "It disproportionately incentivizes impoverished individuals to undergo irreversible physiological risks, undermining genuinely voluntary consent.",
    "explanation": "The primary bioethical condemnation of organ commerce is coercive exploitation: financial desperation compels the indigent to commodify their bodies, compromising autonomous choice.",
    "points": 1,
    "order_index": 14
  },
  {
    "id": "11111111-1111-4111-8111-000000000016",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following statements represents a logical deduction rather than an inductive generalization?",
    "question_type": "multiple_choice",
    "options": [
      "Because three European countries experienced organ donor increases after passing opt-out laws, every nation adopting opt-out will see identical increases.",
      "If every competent person owns their own bodily organs, and no one may take owned property without permission, then harvesting organs without consent violates bodily ownership.",
      "Most patients registered on organ waiting lists will eventually receive a suitable donor match within two years.",
      "Doctors generally prefer performing transplants during daylight hours to avoid surgeon fatigue."
    ],
    "correct_answer": "If every competent person owns their own bodily organs, and no one may take owned property without permission, then harvesting organs without consent violates bodily ownership.",
    "explanation": "This follows strict deductive syllogistic logic: if premises A and B are true, conclusion C must necessarily follow, regardless of empirical observations.",
    "points": 1,
    "order_index": 15
  },
  {
    "id": "11111111-1111-4111-8111-000000000017",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'Healthcare legislation frequently contains conscience clauses allowing medical staff to recuse themselves from participating in procedures—such as pregnancy terminations or assisted suicide—that violate their deeply held moral or religious convictions.'\n\nWhat is the primary constraint placed on conscientious objection in modern medical codes?",
    "question_type": "multiple_choice",
    "options": [
      "Objecting professionals must pay a financial indemnity to the hospital for lost revenue.",
      "The objection must not compromise emergency life-saving care, and the practitioner must refer the patient promptly to an alternative willing provider.",
      "Objectors are prohibited from continuing to practice medicine in public hospitals.",
      "Conscientious objection is permitted only if the patient consents to the doctor's refusal."
    ],
    "correct_answer": "The objection must not compromise emergency life-saving care, and the practitioner must refer the patient promptly to an alternative willing provider.",
    "explanation": "Professional regulatory bodies (such as the UK GMC) permit conscientious objection provided the doctor ensures the patient's care is not disrupted and referrals to willing practitioners are made without delay.",
    "points": 1,
    "order_index": 16
  },
  {
    "id": "11111111-1111-4111-8111-000000000018",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "An ethicist argues: 'Allowing healthcare staff to conscientiously object privatizes professional morality at the expense of patients' statutory rights to lawful healthcare.' Which premise does this argument assume?",
    "question_type": "multiple_choice",
    "options": [
      "Healthcare professionals surrender their individual moral agency when entering a state-regulated monopoly profession.",
      "Physicians never hold genuine moral convictions regarding medical interventions.",
      "All medical procedures should be carried out exclusively by robotic surgical equipment.",
      "Patients never experience inconvenience when referred to a different practitioner."
    ],
    "correct_answer": "Healthcare professionals surrender their individual moral agency when entering a state-regulated monopoly profession.",
    "explanation": "The claim assumes that joining a public monopoly profession entails an obligation to execute all state-sanctioned services, superseding personal conscientious scruples.",
    "points": 1,
    "order_index": 17
  },
  {
    "id": "11111111-1111-4111-8111-000000000019",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Suppose a pharmacist refuses to dispense emergency contraception due to religious beliefs. In a rural community with only one pharmacy, what makes this objection far more legally problematic than in an urban center?",
    "question_type": "multiple_choice",
    "options": [
      "Rural pharmacies generate lower sales volume than metropolitan pharmacies.",
      "The monopoly position creates an insurmountable barrier to time-sensitive healthcare access, transforming the pharmacist's personal refusal into an effective denial of legal rights.",
      "Rural residents are statistically less litigious than city dwellers.",
      "Emergency contraception is less effective when purchased outside major metropolitan areas."
    ],
    "correct_answer": "The monopoly position creates an insurmountable barrier to time-sensitive healthcare access, transforming the pharmacist's personal refusal into an effective denial of legal rights.",
    "explanation": "In single-provider locales, an objection cannot be mitigated by referral; the practitioner's refusal functions as a de facto veto over the patient's lawful access to time-critical medication.",
    "points": 1,
    "order_index": 18
  },
  {
    "id": "11111111-1111-4111-8111-000000000020",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following distinctions is most relevant when evaluating whether a doctor's refusal to treat is a genuine 'conscientious objection' or unlawful discrimination?",
    "question_type": "multiple_choice",
    "options": [
      "Whether the refusal is based on the nature of the clinical procedure itself or on the protected identity characteristics of the patient requesting it.",
      "Whether the doctor graduated in the top quartile of their medical school cohort.",
      "Whether the patient paid for consultation fees via private insurance or public vouchers.",
      "Whether the clinic has achieved carbon-neutral environmental certification."
    ],
    "correct_answer": "Whether the refusal is based on the nature of the clinical procedure itself or on the protected identity characteristics of the patient requesting it.",
    "explanation": "Conscientious objection relates to participating in a specific moral act (e.g. abortion), whereas refusing treatment based on the patient's personal characteristics (e.g. sexual orientation) constitutes illegal discrimination.",
    "points": 1,
    "order_index": 19
  },
  {
    "id": "11111111-1111-4111-8111-000000000021",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'The Doctrine of Double Effect (DDE) asserts that an action with both good and foreseeable bad consequences is morally permissible provided that the bad consequence was not intended either as an end or as a means.'\n\nHow is the Doctrine of Double Effect traditionally applied in palliative end-of-life sedation?",
    "question_type": "multiple_choice",
    "options": [
      "It allows doctors to intentionally hasten death if the patient has exhausted financial resources.",
      "Administering high doses of opioids to relieve intractable pain is lawful even if it foreseeably shortens life, because the intention was analgesia, not termination.",
      "It obligates hospices to withdraw pain medication 48 hours prior to anticipated death.",
      "It allows family members to administer lethal injections under medical supervision."
    ],
    "correct_answer": "Administering high doses of opioids to relieve intractable pain is lawful even if it foreseeably shortens life, because the intention was analgesia, not termination.",
    "explanation": "DDE distinguishes between intending death and foreseeing death as an unintended side effect of escalating palliative analgesia necessary to relieve agony.",
    "points": 1,
    "order_index": 20
  },
  {
    "id": "11111111-1111-4111-8111-000000000022",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Opponents of legalizing physician-assisted suicide frequently invoke the 'slippery slope' argument. Which of the following best characterizes this form of reasoning?",
    "question_type": "multiple_choice",
    "options": [
      "Arguing that an action is wrong because it has never been approved by ancient philosophers.",
      "Arguing that legalizing a restricted practice will inevitably create institutional and normative pressures leading to the widespread erosion of safeguards.",
      "Arguing that assisting suicide is wrong simply because existing statutes prohibit it.",
      "Arguing that all doctors who support assisted dying are motivated by mercenary interests."
    ],
    "correct_answer": "Arguing that legalizing a restricted practice will inevitably create institutional and normative pressures leading to the widespread erosion of safeguards.",
    "explanation": "A slippery slope argument claims that permitting an initially narrow exception will inexorably lead to broader, morally unacceptable applications through boundary expansion.",
    "points": 1,
    "order_index": 21
  },
  {
    "id": "11111111-1111-4111-8111-000000000023",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "In Pretty v United Kingdom (2002), the European Court of Human Rights ruled on whether the right to life under Article 2 of the ECHR encompasses a corresponding 'right to die'. What did the Court determine?",
    "question_type": "multiple_choice",
    "options": [
      "The Court held that Article 2 creates a positive obligation on states to assist terminally ill citizens in ending their lives.",
      "The Court held that Article 2 cannot without distortion be interpreted as conferring the diametrically opposite right to die.",
      "The Court declared that human euthanasia is mandatory for all EU member states.",
      "The Court abolished all domestic criminal statutes penalizing assisted suicide across Europe."
    ],
    "correct_answer": "The Court held that Article 2 cannot without distortion be interpreted as conferring the diametrically opposite right to die.",
    "explanation": "The ECtHR ruled that Article 2 protects the sanctity of life and cannot be inverted into an entitlement to demand state facilitation of suicide.",
    "points": 1,
    "order_index": 22
  },
  {
    "id": "11111111-1111-4111-8111-000000000024",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following statements represents the strongest philosophical distinction between 'withdrawing life-sustaining treatment' and 'administering active lethal injection'?",
    "question_type": "multiple_choice",
    "options": [
      "Withdrawing treatment merely allows the underlying pathology to take its natural fatal course, whereas active injection introduces an independent lethal mechanism.",
      "Withdrawing treatment is completely painless, whereas lethal injections always cause violent convulsions.",
      "Withdrawing treatment is legal only for patients under age 65.",
      "Lethal injection requires hospital management committee approval, whereas withdrawing treatment does not."
    ],
    "correct_answer": "Withdrawing treatment merely allows the underlying pathology to take its natural fatal course, whereas active injection introduces an independent lethal mechanism.",
    "explanation": "In law and philosophy, withdrawing treatment is an omission allowing nature to take its course without unlawful interference, whereas active lethal injection is a positive act causing death.",
    "points": 1,
    "order_index": 23
  },
  {
    "id": "11111111-1111-4111-8111-000000000025",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'Medical confidentiality is not absolute. When maintaining secrecy poses a serious, foreseeable risk of death or significant physical harm to an identifiable third party, the public interest in disclosure may eclipse the duty of confidentiality.'\n\nIn the landmark case of Tarasoff v Regents of the University of California, what fundamental legal duty was established?",
    "question_type": "multiple_choice",
    "options": [
      "A psychotherapist has a legal duty to protect or warn an intended third-party victim when a patient presents a serious danger of violence.",
      "Psychotherapists are strictly forbidden from recording patient disclosures in clinical notes.",
      "Universities are exempt from tort liability arising from student mental health crises.",
      "Confidentiality must be preserved even if an imminent homicide is confessed."
    ],
    "correct_answer": "A psychotherapist has a legal duty to protect or warn an intended third-party victim when a patient presents a serious danger of violence.",
    "explanation": "Tarasoff established that the protective privilege ends where the public peril begins; clinicians must take reasonable steps to warn or protect identified potential victims.",
    "points": 1,
    "order_index": 24
  },
  {
    "id": "11111111-1111-4111-8111-000000000026",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "A patient tests positive for Huntington's disease (a fatal autosomal dominant hereditary condition) but forbids the physician from informing their pregnant adult daughter, who is considering starting a family. What is the central ethical dilemma facing the geneticist?",
    "question_type": "multiple_choice",
    "options": [
      "Whether the genetic test kit used was certified by international quality standards.",
      "Balancing the father's right to medical confidentiality against the daughter's vital reproductive autonomy and actionable interest in her own genetic status.",
      "Determining which medical insurer will pay for the child's future primary school tuition.",
      "Whether Huntington's disease can be cured through herbal dietary supplements."
    ],
    "correct_answer": "Balancing the father's right to medical confidentiality against the daughter's vital reproductive autonomy and actionable interest in her own genetic status.",
    "explanation": "The dilemma directly pits patient confidentiality against the duty of care toward a third party who faces an imminent life-altering reproductive and health decision.",
    "points": 1,
    "order_index": 25
  },
  {
    "id": "11111111-1111-4111-8111-000000000027",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "In ABC v St George's Healthcare NHS Trust (2020), the Court of Appeal examined a clinic's failure to warn a daughter about her father's hereditary Huntington's disease. What was the court's key procedural conclusion regarding a doctor's duty of care?",
    "question_type": "multiple_choice",
    "options": [
      "Doctors never owe any duty of care to a patient's relatives under any circumstances.",
      "A clinician can owe a legal duty of care to conduct a formal risk-balancing assessment when deciding whether to disclose genetic risks to an identifiable family member.",
      "Clinicians must automatically publish genetic data on an open-access public database.",
      "Family members are legally barred from seeking damages against NHS hospital trusts."
    ],
    "correct_answer": "A clinician can owe a legal duty of care to conduct a formal risk-balancing assessment when deciding whether to disclose genetic risks to an identifiable family member.",
    "explanation": "The court recognized that clinicians may owe a duty to balance the patient's confidentiality against the potential harm to close relatives when an actionable genetic risk exists.",
    "points": 1,
    "order_index": 26
  },
  {
    "id": "11111111-1111-4111-8111-000000000028",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following, if true, would most weaken the argument for routinely breaching patient confidentiality in cases of communicable viral infections?",
    "question_type": "multiple_choice",
    "options": [
      "Widespread awareness that confidentiality will be breached causes infected individuals to avoid diagnostic testing and treatment, accelerating hidden transmission.",
      "Contact tracing apps have become increasingly popular among younger smartphone owners.",
      "Hospitals have increased their spending on disposable personal protective equipment.",
      "Most infectious diseases can be identified within forty-eight hours through PCR assays."
    ],
    "correct_answer": "Widespread awareness that confidentiality will be breached causes infected individuals to avoid diagnostic testing and treatment, accelerating hidden transmission.",
    "explanation": "If breaching confidentiality drives infected individuals underground, the policy defeats its own public health objective by increasing clandestine transmission.",
    "points": 1,
    "order_index": 27
  },
  {
    "id": "11111111-1111-4111-8111-000000000029",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'Public health authorities often allocate scarce therapeutic budgets using Quality-Adjusted Life Years (QALYs), where one QALY represents a year of life in perfect health.'\n\nWhat is the primary egalitarian ethical objection to using QALYs as the sole determinant for public drug funding?",
    "question_type": "multiple_choice",
    "options": [
      "QALY calculations require simple arithmetic that computers can perform too quickly.",
      "It systematically discriminates against disabled or elderly individuals because their baseline and potential health gains score lower than those of young, healthy patients.",
      "Pharmaceutical companies refuse to participate in clinical trials evaluating QALY metrics.",
      "It leads doctors to prescribe generic rather than branded medications."
    ],
    "correct_answer": "It systematically discriminates against disabled or elderly individuals because their baseline and potential health gains score lower than those of young, healthy patients.",
    "explanation": "A major critique of QALYs is disability and age bias: treatments for disabled individuals may yield fewer QALYs than treatments for non-disabled individuals, entrenching inequality.",
    "points": 1,
    "order_index": 28
  },
  {
    "id": "11111111-1111-4111-8111-000000000030",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "During a severe ICU bed shortage, two patients require the single available ventilator. Patient X is 25 years old; Patient Y is 78 years old. Both have an equal chance of surviving the acute infection. An allocation scheme based on the 'fair innings' argument would prioritize which patient, and why?",
    "question_type": "multiple_choice",
    "options": [
      "Patient Y, because elderly citizens have contributed taxes to the healthcare system for more years.",
      "Patient X, because everyone is entitled to reach a normal lifespan, and Patient X has experienced fewer life stages.",
      "Patient Y, because older individuals possess greater societal wisdom.",
      "Neither patient; the ventilator must remain unused to preserve moral neutrality."
    ],
    "correct_answer": "Patient X, because everyone is entitled to reach a normal lifespan, and Patient X has experienced fewer life stages.",
    "explanation": "The 'fair innings' argument holds that everyone deserves a fair chance to live through the typical stages of life; those who have not yet reached normal adulthood should be prioritized.",
    "points": 1,
    "order_index": 29
  },
  {
    "id": "11111111-1111-4111-8111-000000000031",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following demonstrates a flaw in the reasoning: 'Because Intensive Care Units generate high survival rates for post-surgical patients, expanding ICU capacity will automatically resolve all hospital backlog problems'?",
    "question_type": "multiple_choice",
    "options": [
      "It confuses correlation with causation.",
      "It assumes that ICU bottlenecks are the sole constraint, ignoring dependencies on regular ward beds, specialized nursing staff, and operating theater availability.",
      "It fails to define the word 'hospital' in precise grammatical terms.",
      "It assumes all surgeons receive equal salaries regardless of surgical specialty."
    ],
    "correct_answer": "It assumes that ICU bottlenecks are the sole constraint, ignoring dependencies on regular ward beds, specialized nursing staff, and operating theater availability.",
    "explanation": "This is a fallacy of composition/single-cause oversight: expanding one link in a complex interconnected healthcare chain cannot resolve systemic backlogs if other bottlenecks persist.",
    "points": 1,
    "order_index": 30
  },
  {
    "id": "11111111-1111-4111-8111-000000000032",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "A utilitarian bioethicist asserts: 'The only rational healthcare rationing policy is one that maximizes the aggregate health utility of the entire population.' Which moral consideration does this policy entirely ignore?",
    "question_type": "multiple_choice",
    "options": [
      "The total financial cost of the healthcare system.",
      "The fairness of distribution (equity) and the special moral duty owed to the worst-off individuals.",
      "The necessity of maintaining hygienic hospital wards.",
      "The rate of medical inflation relative to sovereign debt yields."
    ],
    "correct_answer": "The fairness of distribution (equity) and the special moral duty owed to the worst-off individuals.",
    "explanation": "Utilitarianism aggregates total utility regardless of distribution, meaning it will gladly sacrifice the interests of severely ill minorities if doing so yields minor gains for a vast majority.",
    "points": 1,
    "order_index": 31
  },
  {
    "id": "11111111-1111-4111-8111-000000000033",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'In Gillick v West Norfolk and Wisbech AHA (1985), the House of Lords held that a child under 16 can consent to medical treatment without parental knowledge if they achieve sufficient understanding and intelligence to comprehend fully what is proposed.'\n\nWhat is the defining standard for determining 'Gillick competence' in minor patients?",
    "question_type": "multiple_choice",
    "options": [
      "Whether the minor has reached their fourteenth birthday.",
      "Whether the child possesses the maturity and cognitive capacity to understand the nature, risks, and implications of the proposed treatment.",
      "Whether the parents have formally delegated their parental responsibility in writing.",
      "Whether the minor has completed compulsory secondary education."
    ],
    "correct_answer": "Whether the child possesses the maturity and cognitive capacity to understand the nature, risks, and implications of the proposed treatment.",
    "explanation": "Gillick established that competence is developmental rather than chronological; a minor is competent when they understand the proposed treatment's nature and consequences.",
    "points": 1,
    "order_index": 32
  },
  {
    "id": "11111111-1111-4111-8111-000000000034",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "In English law (e.g. Re W [1993]), how does a Gillick-competent adolescent's right to *refuse* life-saving treatment differ from their right to *consent* to treatment?",
    "question_type": "multiple_choice",
    "options": [
      "There is no legal difference; refusal and consent have identical legal authority.",
      "A competent minor's consent is legally effective, but their refusal can be overridden by a court or someone with parental responsibility if in their best interests.",
      "Minors are never permitted to consent to any treatment without a judicial order.",
      "Refusal is permitted only if accompanied by a signed agreement from three consultants."
    ],
    "correct_answer": "A competent minor's consent is legally effective, but their refusal can be overridden by a court or someone with parental responsibility if in their best interests.",
    "explanation": "English law adopts an asymmetrical approach: a competent minor's consent authorizes doctors to proceed, but their refusal does not extinguish the court's or parents' power to consent in life-threatening scenarios.",
    "points": 1,
    "order_index": 33
  },
  {
    "id": "11111111-1111-4111-8111-000000000035",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Suppose parents refuse a blood transfusion for their comatose 6-year-old child on religious grounds. Why will an emergency court order invariably authorize the transfusion despite parental rights?",
    "question_type": "multiple_choice",
    "options": [
      "Because the state's parens patriae duty to preserve the child's life and fundamental interests supersedes parental religious convictions.",
      "Because blood transfusions are entirely free of infectious risks.",
      "Because religious freedom is not recognized for parents with dependent children.",
      "Because the child previously signed a hospital admission waiver."
    ],
    "correct_answer": "Because the state's parens patriae duty to preserve the child's life and fundamental interests supersedes parental religious convictions.",
    "explanation": "Under the doctrine of parens patriae, the state's obligation to protect vulnerable children from avoidable death or irreversible harm overrides parental religious preferences.",
    "points": 1,
    "order_index": 34
  },
  {
    "id": "11111111-1111-4111-8111-000000000036",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following scenarios best demonstrates an inconsistent application of the principle of adolescent autonomy?",
    "question_type": "multiple_choice",
    "options": [
      "Allowing a 15-year-old to consent to confidential contraception, but allowing a court to override that same 15-year-old's refusal of an emergency appendectomy.",
      "Requiring both parents to agree to an elective cosmetic surgery on an infant.",
      "Granting a 17-year-old full testamentary capacity to draft a valid will.",
      "Treating an unconscious adult in an emergency room without prior written consent."
    ],
    "correct_answer": "Allowing a 15-year-old to consent to confidential contraception, but allowing a court to override that same 15-year-old's refusal of an emergency appendectomy.",
    "explanation": "Critics highlight the tension where an adolescent is deemed sufficiently autonomous to consent to intimate reproductive healthcare, yet denied the autonomy to refuse invasive surgery.",
    "points": 1,
    "order_index": 35
  },
  {
    "id": "11111111-1111-4111-8111-000000000037",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'Deep learning diagnostic models increasingly surpass human radiologists in detecting subtle malignant neoplasms. Yet, the inscrutable \"black-box\" nature of neural networks creates an epistemic hurdle for clinical liability.'\n\nIf an AI diagnostic tool generates an unexplainable recommendation that contradicts a senior doctor's clinical intuition, what is the primary legal danger of the doctor blindly deferring to the AI?",
    "question_type": "multiple_choice",
    "options": [
      "The hospital software subscription fees will automatically increase.",
      "The doctor breaches their non-delegable duty of professional judgment and cannot establish a reasoned clinical basis under standard negligence tests.",
      "The computer hardware will overheat from processing conflicting diagnostic data.",
      "The patient's health insurance policy will automatically be cancelled."
    ],
    "correct_answer": "The doctor breaches their non-delegable duty of professional judgment and cannot establish a reasoned clinical basis under standard negligence tests.",
    "explanation": "Physicians have a non-delegable duty of care; blindly deferring to an unexplainable algorithm without exercising independent clinical reasoning risks liability for medical malpractice.",
    "points": 1,
    "order_index": 36
  },
  {
    "id": "11111111-1111-4111-8111-000000000038",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following arguments relies on a false dichotomy regarding AI in medical decision-making?",
    "question_type": "multiple_choice",
    "options": [
      "Either we prohibit all artificial intelligence in hospitals, or we accept completely unmonitored autonomous algorithmic surgery.",
      "AI diagnostics should be rigorously evaluated in randomized clinical trials before widespread hospital deployment.",
      "Physicians should disclose to patients whenever an AI tool contributes significantly to their diagnostic pathway.",
      "Data privacy regulations must adapt to prevent unauthorized commercial scraping of medical images."
    ],
    "correct_answer": "Either we prohibit all artificial intelligence in hospitals, or we accept completely unmonitored autonomous algorithmic surgery.",
    "explanation": "This creates a false dilemma by presenting two extreme caricatures (total ban vs unmonitored automation), ignoring the nuanced reality of clinician-in-the-loop hybrid systems.",
    "points": 1,
    "order_index": 37
  },
  {
    "id": "11111111-1111-4111-8111-000000000039",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Suppose an AI diagnostic algorithm trained predominantly on demographic data from light-skinned patients demonstrates a 40% higher error rate when diagnosing melanomas on dark-skinned patients. In tort law, which party is most likely to face product liability claims for this systemic defect?",
    "question_type": "multiple_choice",
    "options": [
      "The postal courier service that delivered the computer servers.",
      "The medical software manufacturer that developed, validated, and marketed the clinically unrepresentative diagnostic model.",
      "The individual patient whose skin tone was not represented in the training dataset.",
      "The electric power utility supplying electricity to the hospital."
    ],
    "correct_answer": "The medical software manufacturer that developed, validated, and marketed the clinically unrepresentative diagnostic model.",
    "explanation": "Under strict product liability rules, manufacturers are liable for placing defective products (including algorithmic medical software with foreseeable demographic biases) into commercial circulation.",
    "points": 1,
    "order_index": 38
  },
  {
    "id": "11111111-1111-4111-8111-000000000040",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Passage Excerpt: 'John Stuart Mill's Harm Principle asserts that the only purpose for which power can be rightfully exercised over any member of a civilized community, against his will, is to prevent harm to others. His own good, either physical or moral, is not a sufficient warrant.'\n\nHow does Mill's Harm Principle justify compulsory quarantine during an outbreak of an airborne pathogen?",
    "question_type": "multiple_choice",
    "options": [
      "It allows the state to punish citizens who fail to maintain healthy diets.",
      "Quarantine prevents an infectious individual from causing catastrophic physical harm to non-consenting members of the public.",
      "It promotes commercial economic activity by subsidizing pharmaceutical corporations.",
      "It holds that individual bodily integrity is an illusion created by modern legal systems."
    ],
    "correct_answer": "Quarantine prevents an infectious individual from causing catastrophic physical harm to non-consenting members of the public.",
    "explanation": "Mill explicitly authorized state coercion when an individual's conduct risks imposing direct physical injury or infection on other unconsenting members of the community.",
    "points": 1,
    "order_index": 39
  },
  {
    "id": "11111111-1111-4111-8111-000000000041",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "Which of the following health policies would violate Mill's Harm Principle by being purely paternalistic?",
    "question_type": "multiple_choice",
    "options": [
      "Mandating that motorists wear seatbelts solely to protect themselves from serious injury in solo collisions.",
      "Prohibiting individuals from dumping toxic chemicals into municipal drinking reservoirs.",
      "Restricting public indoor smoking to protect innocent bystanders from second-hand smoke inhalation.",
      "Requiring food handling workers to undergo screening for transmissible gastrointestinal bacteria."
    ],
    "correct_answer": "Mandating that motorists wear seatbelts solely to protect themselves from serious injury in solo collisions.",
    "explanation": "Seatbelt mandates designed solely to protect the driver from harming themselves are purely paternalistic; they coerce an individual for their own physical good rather than to prevent harm to others.",
    "points": 1,
    "order_index": 40
  },
  {
    "id": "11111111-1111-4111-8111-000000000042",
    "test_id": "11111111-1111-4111-8111-111111111111",
    "question_text": "An advocate for mandatory vaccination argues: 'Choosing to remain unvaccinated against a virulent airborne virus is morally equivalent to driving a car while intoxicated.' What is the underlying point of analogy in this argument?",
    "question_type": "multiple_choice",
    "options": [
      "Both behaviors involve mechanical engine operation in urban environments.",
      "Both behaviors voluntarily create an unreasonable, potentially fatal risk of physical harm to innocent bystanders sharing a public space.",
      "Both behaviors are exclusively practiced by younger demographics.",
      "Both behaviors carry identical monetary fines in criminal court."
    ],
    "correct_answer": "Both behaviors voluntarily create an unreasonable, potentially fatal risk of physical harm to innocent bystanders sharing a public space.",
    "explanation": "The analogy hinges on the imposition of unjustified risk upon bystanders in public spaces, arguing that individual preference cannot justify endangering others.",
    "points": 1,
    "order_index": 41
  },
  {
    "id": "22222222-2222-4222-8222-000000000001",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'In arguing that top civil servants possess a \"conservative\" institutional outlook, critics contend that senior mandarins are not merely impartial implementers of ministerial policy. Rather, their shared socio-economic background, educational pedigree, and administrative traditions lead them to instinctively preserve existing economic and social hierarchies.'\n\nIn arguing that top civil servants possess a 'conservative' institutional outlook, the author's primary contention is that:",
    "question_type": "multiple_choice",
    "options": [
      "Senior civil servants consistently vote for right-wing political parties in general elections.",
      "Their shared elite socio-economic background, education, and administrative habits lead them to instinctively preserve existing economic and social hierarchies.",
      "They resist introducing technological modernization across public service departments.",
      "They deliberately sabotage legislative statutes enacted by democratically elected radical governments."
    ],
    "correct_answer": "Their shared elite socio-economic background, education, and administrative habits lead them to instinctively preserve existing economic and social hierarchies.",
    "explanation": "The passage defines conservatism not in terms of ballot-box party allegiance, but as a sociological reflex stemming from shared elite schooling and class backgrounds that inclines officials to defend the established social order.",
    "points": 1,
    "order_index": 0
  },
  {
    "id": "22222222-2222-4222-8222-000000000002",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "According to the passage, why is the orthodox doctrine of 'civil service neutrality' misleading?",
    "question_type": "multiple_choice",
    "options": [
      "Because permanent secretaries are routinely bribed by private corporate lobbyists.",
      "Because ministers rarely consult department heads prior to announcing major policy reforms.",
      "Because it conflates the absence of overt partisan bias with genuine ideological neutrality regarding the prevailing socio-economic system.",
      "Because civil service employment contracts forbid senior staff from joining professional associations."
    ],
    "correct_answer": "Because it conflates the absence of overt partisan bias with genuine ideological neutrality regarding the prevailing socio-economic system.",
    "explanation": "The author demonstrates that a civil servant can be completely even-handed between rival political parties while simultaneously maintaining deep, uncritical allegiance to the prevailing property and economic structure.",
    "points": 1,
    "order_index": 1
  },
  {
    "id": "22222222-2222-4222-8222-000000000003",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following developments would pose the most direct challenge to the author's thesis regarding bureaucratic conservatism?",
    "question_type": "multiple_choice",
    "options": [
      "Official data showing that senior civil service recruitment from non-elite backgrounds and diverse universities has genuinely restructured the demographic profile and mindset of leadership ranks.",
      "Historical records showing that civil servants faithfully drafted bills for postwar reforming governments.",
      "Evidence that permanent secretaries earn substantially less than corporate finance directors.",
      "Public opinion polls revealing high levels of voter trust in civil service integrity."
    ],
    "correct_answer": "Official data showing that senior civil service recruitment from non-elite backgrounds and diverse universities has genuinely restructured the demographic profile and mindset of leadership ranks.",
    "explanation": "The author's thesis relies directly on demographic homogeneity generating an elite class outlook. Demonstrating genuine demographic diversification directly weakens that foundational premise.",
    "points": 1,
    "order_index": 2
  },
  {
    "id": "22222222-2222-4222-8222-000000000004",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following analogies most accurately captures the relationship between senior civil servants and elected government ministers described in the text?",
    "question_type": "multiple_choice",
    "options": [
      "A ship's permanent navigation crew whose ingrained routines quietly channel and limit the course chosen by rotating guest captains.",
      "An impartial referee in an athletic contest who enforces rules without having any stake in the winning team.",
      "A defense attorney who zealously advocates whatever position their changing client commands.",
      "A laboratory technician executing invariant mechanical procedures set by a lead scientist."
    ],
    "correct_answer": "A ship's permanent navigation crew whose ingrained routines quietly channel and limit the course chosen by rotating guest captains.",
    "explanation": "Ministers are temporary political appointees who come and go (guest captains), whereas the permanent administrative echelon possesses continuous institutional momentum that subtly steers policy within safe, conventional boundaries.",
    "points": 1,
    "order_index": 3
  },
  {
    "id": "22222222-2222-4222-8222-000000000005",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'A.V. Dicey defined Parliamentary Sovereignty as the principle that Parliament has the right to make or unmake any law whatever, and no person or body is recognised by the law of England as having a right to override or set aside the legislation of Parliament.'\n\nWhich of the following scenarios would represent an impossible act under Dicey's pure conception of Parliamentary Sovereignty?",
    "question_type": "multiple_choice",
    "options": [
      "Parliament passing an Act that retrospectively criminalizes conduct that was legal when committed.",
      "Parliament passing an Act that binds all future Parliaments by making it legally impossible to repeal that Act.",
      "Parliament dissolving itself and extending its own duration during wartime.",
      "Parliament abolishing the monarchy through a simple majority statute."
    ],
    "correct_answer": "Parliament passing an Act that binds all future Parliaments by making it legally impossible to repeal that Act.",
    "explanation": "Under Dicey's doctrine, Parliament cannot bind its successors. A sovereign Parliament that could restrict future Parliaments would destroy the sovereignty of those subsequent Parliaments.",
    "points": 1,
    "order_index": 4
  },
  {
    "id": "22222222-2222-4222-8222-000000000006",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Lord Bingham described the Rule of Law as requiring that all persons and authorities within the state should be bound by and entitled to the benefit of laws publicly made, taking effect in the future and publicly administered in the courts. Which policy most blatantly infringes this principle?",
    "question_type": "multiple_choice",
    "options": [
      "Publishing new traffic regulations in an online statutory instrument database 30 days prior to enforcement.",
      "Enacting a retroactive criminal statute that imposes punitive fines on actions taken five years prior when they were fully compliant with the law.",
      "Appointing legally qualified magistrates to adjudicate municipal civil parking disputes.",
      "Requiring government departments to undergo annual independent financial auditing."
    ],
    "correct_answer": "Enacting a retroactive criminal statute that imposes punitive fines on actions taken five years prior when they were fully compliant with the law.",
    "explanation": "Retroactive criminalization violates the core requirement of legal certainty and prospectivity: citizens cannot conform their conduct to laws that did not exist when they acted.",
    "points": 1,
    "order_index": 5
  },
  {
    "id": "22222222-2222-4222-8222-000000000007",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'In Jackson v Attorney General (2005), several Law Lords suggested obiter that if Parliament attempted to abolish judicial review or the ordinary role of the courts, judges might be compelled to refuse to enforce such a statute.'\n\nWhat fundamental constitutional assumption does this judicial proposition challenge?",
    "question_type": "multiple_choice",
    "options": [
      "The constitutional convention that judges must retire at age seventy-five.",
      "The orthodox doctrine that Parliamentary Sovereignty is unlimited and hierarchically supreme over the judiciary in all circumstances.",
      "The requirement that criminal trials in the Crown Court must involve a jury of twelve peers.",
      "The rule that statutory interpretation must follow the plain literal meaning of legislative texts."
    ],
    "correct_answer": "The orthodox doctrine that Parliamentary Sovereignty is unlimited and hierarchically supreme over the judiciary in all circumstances.",
    "explanation": "The suggestion in Jackson posits that the rule of law is the ultimate constitutional foundation, implying courts might invalidate an Act of Parliament that seeks to destroy democracy or the judicial role.",
    "points": 1,
    "order_index": 6
  },
  {
    "id": "22222222-2222-4222-8222-000000000008",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following statements represents an inductive generalization rather than a formal deductive entailment?",
    "question_type": "multiple_choice",
    "options": [
      "If all primary statutes passed by Parliament are supreme law, and the 1998 Human Rights Act is a primary statute, then the Human Rights Act is supreme law.",
      "Because every constitutional monarch over the last two centuries has granted Royal Assent to bills passed by both Houses, the current monarch will never withhold Royal Assent.",
      "A defendant who is criminally convicted cannot simultaneously be declared completely innocent by the sentencing judge.",
      "Either the executive obeys the judicial writ of habeas corpus, or it detains citizens without valid judicial authorization."
    ],
    "correct_answer": "Because every constitutional monarch over the last two centuries has granted Royal Assent to bills passed by both Houses, the current monarch will never withhold Royal Assent.",
    "explanation": "This is an inductive inference based on historical regularity (the past two centuries) generalized into a universal prediction, rather than a logically guaranteed deductive necessity.",
    "points": 1,
    "order_index": 7
  },
  {
    "id": "22222222-2222-4222-8222-000000000009",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'In R (Miller) v The Prime Minister (2019), commonly known as Miller II, the UK Supreme Court ruled unanimously that the Prime Minister's advice to prorogue Parliament for five weeks during intense Brexit deliberations was non-justiciable prerogative power had been unlawfully exceeded.'\n\nOn what constitutional rationale did the Supreme Court base its jurisdiction to review the prorogation of Parliament?",
    "question_type": "multiple_choice",
    "options": [
      "The court held that judges have the political power to dismiss a Prime Minister at will.",
      "The court held that while the exercise of prerogative power is political, determining the legal limits of that prerogative is a fundamental constitutional duty of the courts.",
      "The court ruled that prorogation of Parliament has been forbidden by common law since 1688.",
      "The court concluded that five weeks is too short a recess for MPs to complete committee work."
    ],
    "correct_answer": "The court held that while the exercise of prerogative power is political, determining the legal limits of that prerogative is a fundamental constitutional duty of the courts.",
    "explanation": "The Supreme Court reaffirmed the historic principle that the courts determine whether a prerogative power exists and what its legal limits are, ensuring the executive cannot nullify parliamentary accountability.",
    "points": 1,
    "order_index": 8
  },
  {
    "id": "22222222-2222-4222-8222-000000000010",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "According to Montesquieu's tripartite separation of powers, why must the judicial branch remain strictly independent from the legislature and the executive?",
    "question_type": "multiple_choice",
    "options": [
      "To ensure judges receive lifetime pensions without legislative scrutiny.",
      "Because when legislative and executive powers are united with the judiciary in the same body, there can be no liberty, as arbitrary tyranny inevitably ensues.",
      "To ensure that judicial proceedings are conducted entirely behind closed doors.",
      "Because legislators are not educated in common law statutory interpretation."
    ],
    "correct_answer": "Because when legislative and executive powers are united with the judiciary in the same body, there can be no liberty, as arbitrary tyranny inevitably ensues.",
    "explanation": "Montesquieu argued that concentrating the powers to enact, execute, and judge laws in a single body extinguishes personal liberty and gives rise to arbitrary despotic power.",
    "points": 1,
    "order_index": 9
  },
  {
    "id": "22222222-2222-4222-8222-000000000011",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "A constitutional theorist claims: 'The British Constitution does not feature a separation of powers, but rather a fusion of powers in the executive-dominated Cabinet.' Which feature of the UK system provides the strongest support for this claim?",
    "question_type": "multiple_choice",
    "options": [
      "Judges are appointed by an independent Judicial Appointments Commission.",
      "Ministers who form the executive government must simultaneously be sitting members of Parliament in the House of Commons or House of Lords.",
      "The Supreme Court sits in Middlesex Guildhall across from Parliament Square.",
      "Police constables take an oath of allegiance to the reigning sovereign."
    ],
    "correct_answer": "Ministers who form the executive government must simultaneously be sitting members of Parliament in the House of Commons or House of Lords.",
    "explanation": "Walter Bagehot famously described the Cabinet as the 'hyphen that joins, the buckle that fastens' the legislative and executive departments together, since ministers are drawn directly from Parliament.",
    "points": 1,
    "order_index": 10
  },
  {
    "id": "22222222-2222-4222-8222-000000000012",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following, if true, would most weaken the argument that judicial review in public law constitutes an anti-democratic usurpation of parliamentary authority?",
    "question_type": "multiple_choice",
    "options": [
      "Judges are not elected by public voters in general elections.",
      "Judicial review does not strike down primary legislation, but merely ensures that government ministers and public bodies do not exceed the statutory powers granted to them by Parliament.",
      "Judges in the High Court earn higher annual salaries than backbench members of Parliament.",
      "Judicial review applications have increased by thirty percent over the last twenty years."
    ],
    "correct_answer": "Judicial review does not strike down primary legislation, but merely ensures that government ministers and public bodies do not exceed the statutory powers granted to them by Parliament.",
    "explanation": "If judicial review primarily upholds parliamentary intent by preventing executive overreach beyond statutory mandates, it reinforces rather than undermines parliamentary supremacy.",
    "points": 1,
    "order_index": 11
  },
  {
    "id": "22222222-2222-4222-8222-000000000013",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'Under Article 10 of the European Convention on Human Rights, freedom of expression is a qualified right. It may be subjected to such formalities, conditions, restrictions or penalties as are prescribed by law and are necessary in a democratic society in the interests of national security, territorial integrity or public safety.'\n\nWhat is the defining test used by constitutional courts to determine whether a restriction on political expression is 'necessary in a democratic society'?",
    "question_type": "multiple_choice",
    "options": [
      "Whether a majority of citizens voted in favor of the restriction in a nationwide referendum.",
      "Whether the interference responds to a pressing social need and is proportionate to the legitimate aim pursued.",
      "Whether the police commissioner personally approved the content of the speech.",
      "Whether the speaker had been convicted of a misdemeanor within the previous five years."
    ],
    "correct_answer": "Whether the interference responds to a pressing social need and is proportionate to the legitimate aim pursued.",
    "explanation": "The established Strasbourg test requires proving that the restriction meets a 'pressing social need' and that the measures adopted are strictly proportionate to the legitimate aim.",
    "points": 1,
    "order_index": 12
  },
  {
    "id": "22222222-2222-4222-8222-000000000014",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "What is meant by the legal concept of a 'chilling effect' in constitutional jurisprudence concerning free expression?",
    "question_type": "multiple_choice",
    "options": [
      "The physical reduction in ambient outdoor temperatures during winter protest rallies.",
      "The phenomenon where ambiguous or overly punitive speech regulations deter citizens from engaging in lawful public debate out of fear of prosecution.",
      "The mandatory cooling-off period required before filing an appeal in a defamation tribunal.",
      "The practice of broadcasting courtroom trials on delayed television networks."
    ],
    "correct_answer": "The phenomenon where ambiguous or overly punitive speech regulations deter citizens from engaging in lawful public debate out of fear of prosecution.",
    "explanation": "A 'chilling effect' occurs when vague, sweeping laws cause individuals to self-censor legitimate, protected speech because they cannot be certain whether they will face legal sanctions.",
    "points": 1,
    "order_index": 13
  },
  {
    "id": "22222222-2222-4222-8222-000000000015",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "A municipal authority bans all public protests outside an international arms trade convention, citing concerns about traffic congestion. Applying the principle of proportionality, which is the strongest argument that the ban is unlawful?",
    "question_type": "multiple_choice",
    "options": [
      "Arms dealers are wealthy and can afford private helicopter transport.",
      "A blanket prohibition is disproportionate because traffic management measures and designated protest zones could accommodate both free assembly and reasonable vehicular flow.",
      "Demonstrators have an absolute right to obstruct any motorway indefinitely under customary international law.",
      "Municipal councils have no statutory authority over paved public highways."
    ],
    "correct_answer": "A blanket prohibition is disproportionate because traffic management measures and designated protest zones could accommodate both free assembly and reasonable vehicular flow.",
    "explanation": "Proportionality requires that the state select the least restrictive means that achieves the legitimate goal. A total ban where traffic management would suffice fails the test.",
    "points": 1,
    "order_index": 14
  },
  {
    "id": "22222222-2222-4222-8222-000000000016",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following propositions represents a normative ethical assertion regarding free speech?",
    "question_type": "multiple_choice",
    "options": [
      "Section 127 of the Communications Act 2003 criminalizes sending grossly offensive messages via public electronic networks.",
      "Speech that challenges political orthodoxy should be accorded the highest degree of constitutional protection.",
      "The Supreme Court of the United States ruled on the First Amendment in Brandenburg v Ohio.",
      "Internet service providers can block IP addresses using packet inspection firewalls."
    ],
    "correct_answer": "Speech that challenges political orthodoxy should be accorded the highest degree of constitutional protection.",
    "explanation": "The assertion that political speech 'should be accorded' the highest protection is a normative value judgment about what ought to be, whereas the other options state empirical or legal facts.",
    "points": 1,
    "order_index": 15
  },
  {
    "id": "22222222-2222-4222-8222-000000000017",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'Constitutional conventions are non-legal rules of political practice regarded as binding by those to whom they apply. They oil the wheels of the constitution, transforming legal powers into democratic realities.'\n\nWhat is the defining difference between a constitutional statute and a constitutional convention?",
    "question_type": "multiple_choice",
    "options": [
      "Statutes are published in book form, whereas conventions are strictly oral rumors.",
      "Statutes are legally enforceable by the courts, whereas conventions are political understandings that the courts will recognize but will not directly enforce as law.",
      "Statutes apply only to commoners, whereas conventions bind only the reigning sovereign.",
      "Statutes require a ninety percent parliamentary supermajority, whereas conventions require a simple plurality."
    ],
    "correct_answer": "Statutes are legally enforceable by the courts, whereas conventions are political understandings that the courts will recognize but will not directly enforce as law.",
    "explanation": "As reaffirmed in cases like Jonathan Cape (1976) and Miller I (2017), constitutional conventions are political obligations; courts may take notice of their existence but cannot enforce them as legal rules.",
    "points": 1,
    "order_index": 16
  },
  {
    "id": "22222222-2222-4222-8222-000000000018",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "According to Sir Ivor Jennings' famous three-part test, what is required to establish the existence of a constitutional convention?",
    "question_type": "multiple_choice",
    "options": [
      "A written Royal Charter, approval by the Privy Council, and registration with the High Court.",
      "Historical precedents for the practice, a belief by political actors that they are bound by the rule, and a constitutional reason for the rule.",
      "Unanimous approval by both Houses of Parliament across three successive sessions.",
      "A five-year period of continuous observation without any public criticism."
    ],
    "correct_answer": "Historical precedents for the practice, a belief by political actors that they are bound by the rule, and a constitutional reason for the rule.",
    "explanation": "The Jennings test asks: (1) what are the precedents? (2) did the actors believe that they were bound by a rule? and (3) is there a reason for the rule?",
    "points": 1,
    "order_index": 17
  },
  {
    "id": "22222222-2222-4222-8222-000000000019",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "The convention of 'Cabinet Collective Responsibility' requires that:",
    "question_type": "multiple_choice",
    "options": [
      "All Cabinet ministers must resign immediately if a single minister contracts an infectious illness.",
      "Cabinet ministers may openly debate policies in private, but must publicly support all government decisions or resign from office.",
      "Every piece of legislation must be drafted jointly by all members of the Cabinet.",
      "Ministers must share their official state salaries equally with junior civil servants."
    ],
    "correct_answer": "Cabinet ministers may openly debate policies in private, but must publicly support all government decisions or resign from office.",
    "explanation": "Cabinet collective responsibility ensures the government presents a united front: ministers can dissent internally, but must endorse the agreed position in public or surrender their ministerial portfolio.",
    "points": 1,
    "order_index": 18
  },
  {
    "id": "22222222-2222-4222-8222-000000000020",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "If a Prime Minister breaches the Ministerial Code by misleading Parliament, why cannot a court declare the Prime Minister's continued tenure in office void?",
    "question_type": "multiple_choice",
    "options": [
      "Because the Ministerial Code is an internal political code of conduct, not a statutory enactment, and enforcement rests solely with the Prime Minister and Parliament.",
      "Because courts are closed during general election campaigns.",
      "Because Prime Ministers enjoy absolute immunity from all legal and constitutional scrutiny under Magna Carta.",
      "Because MPs are legally forbidden from testifying before High Court tribunals."
    ],
    "correct_answer": "Because the Ministerial Code is an internal political code of conduct, not a statutory enactment, and enforcement rests solely with the Prime Minister and Parliament.",
    "explanation": "The Ministerial Code is an executive guideline rather than an Act of Parliament; policing adherence belongs to the political sphere rather than the judicial courts.",
    "points": 1,
    "order_index": 19
  },
  {
    "id": "22222222-2222-4222-8222-000000000021",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'The Sewel Convention establishes that the UK Parliament at Westminster will \"not normally\" legislate with regard to devolved matters without the consent of the devolved legislatures in Edinburgh, Cardiff, or Belfast.'\n\nIn R (Miller) v Secretary of State for Exiting the European Union (2017), what did the Supreme Court conclude regarding the legal enforceability of the Sewel Convention?",
    "question_type": "multiple_choice",
    "options": [
      "The court held that the Sewel Convention is legally enforceable and blocked the Brexit notification until the Scottish Parliament consented.",
      "The court held that the Sewel Convention, despite being referenced in the Scotland Act 2016, remains an unenforceable political convention beyond judicial policing.",
      "The court ruled that Scotland had automatically seceded from the United Kingdom upon the EU referendum result.",
      "The court declared that devolved assemblies have absolute legislative vetoes over all UK international treaties."
    ],
    "correct_answer": "The court held that the Sewel Convention, despite being referenced in the Scotland Act 2016, remains an unenforceable political convention beyond judicial policing.",
    "explanation": "The Supreme Court held that statutory recognition of the Sewel Convention did not convert a political convention into an enforceable legal rule; Westminster retains ultimate sovereign authority to legislate.",
    "points": 1,
    "order_index": 20
  },
  {
    "id": "22222222-2222-4222-8222-000000000022",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "What is the primary conceptual distinction between a federal system (like the United States) and the UK's asymmetric devolution settlement?",
    "question_type": "multiple_choice",
    "options": [
      "In a federal system, states have their own flags, whereas devolved nations do not.",
      "In a federal system, state powers are entrenched in a supreme written constitution that the central legislature cannot unilaterally abolish, whereas in the UK, Westminster retains legal sovereignty to alter or abolish devolved powers.",
      "Federal states never collect regional sales taxes.",
      "Devolved parliaments have larger legislative chambers than federal state senates."
    ],
    "correct_answer": "In a federal system, state powers are entrenched in a supreme written constitution that the central legislature cannot unilaterally abolish, whereas in the UK, Westminster retains legal sovereignty to alter or abolish devolved powers.",
    "explanation": "Federalism divides sovereignty through a supreme entrenched constitution; in the UK, devolution is statutory, meaning Parliament can in theory unilaterally amend or repeal devolved powers.",
    "points": 1,
    "order_index": 21
  },
  {
    "id": "22222222-2222-4222-8222-000000000023",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "The 'West Lothian Question' (Tam Dalyell's dilemma) addresses which constitutional asymmetry?",
    "question_type": "multiple_choice",
    "options": [
      "Why Scottish MPs at Westminster could vote on domestic laws affecting England, while English MPs could not vote on those same matters within Scotland after devolution.",
      "Why Wales has fewer parliamentary constituencies than Northern Ireland.",
      "Why Scotland maintains a distinct common law legal system from England and Wales.",
      "Why the UK Prime Minister is rarely an MP from a Scottish constituency."
    ],
    "correct_answer": "Why Scottish MPs at Westminster could vote on domestic laws affecting England, while English MPs could not vote on those same matters within Scotland after devolution.",
    "explanation": "The West Lothian Question highlights the anomaly where devolved-area MPs can vote on English-only legislation at Westminster, while English MPs have no say over devolved Scottish matters.",
    "points": 1,
    "order_index": 22
  },
  {
    "id": "22222222-2222-4222-8222-000000000024",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following would be an unstated assumption in the argument: 'Because Northern Ireland's power-sharing executive frequently collapses due to sectarian deadlock, direct rule from Westminster should be permanently restored'?",
    "question_type": "multiple_choice",
    "options": [
      "That administrative efficiency and stability are morally superior to local democratic cross-community consent.",
      "That Northern Ireland generates more tax revenue than Wales.",
      "That Westminster politicians are universally disliked in Belfast.",
      "That cross-community voting rules are identical to municipal council elections."
    ],
    "correct_answer": "That administrative efficiency and stability are morally superior to local democratic cross-community consent.",
    "explanation": "To advocate permanent direct rule because of local impasse, the speaker must assume that administrative continuity outweighs the vital Good Friday Agreement requirement of cross-community consent.",
    "points": 1,
    "order_index": 23
  },
  {
    "id": "22222222-2222-4222-8222-000000000025",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'In the landmark Belmarsh case (A v Secretary of State for the Home Department [2004]), the House of Lords considered the indefinite detention of foreign terrorist suspects without trial under the Anti-terrorism, Crime and Security Act 2001.'\n\nOn what two primary grounds did the Law Lords issue a Declaration of Incompatibility under Section 4 of the Human Rights Act?",
    "question_type": "multiple_choice",
    "options": [
      "The detention facilities were located too far from London, and prisoner uniforms were inadequate.",
      "The measures were disproportionate to the security threat and unjustifiably discriminated between foreign suspects and British suspects facing identical allegations.",
      "The police had failed to interview the suspects within 24 hours of arrest.",
      "Parliament had neglected to conduct a cost-benefit economic assessment of indefinite imprisonment."
    ],
    "correct_answer": "The measures were disproportionate to the security threat and unjustifiably discriminated between foreign suspects and British suspects facing identical allegations.",
    "explanation": "The Law Lords held that locking up foreign terror suspects without trial while leaving British citizens posing the exact same threat free was disproportionate and impermissibly discriminatory.",
    "points": 1,
    "order_index": 24
  },
  {
    "id": "22222222-2222-4222-8222-000000000026",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Under the Civil Contingencies Act 2004, what fundamental safeguard limits the executive's power to make emergency regulations?",
    "question_type": "multiple_choice",
    "options": [
      "The Prime Minister must hold a press conference within six hours of issuing regulations.",
      "Emergency regulations lapse after seven days unless approved by resolution of each House of Parliament, and cannot amend the Human Rights Act 1998.",
      "Emergency regulations must be countersigned by the Lord Chief Justice.",
      "Regulations can only apply to geographic territories south of the River Thames."
    ],
    "correct_answer": "Emergency regulations lapse after seven days unless approved by resolution of each House of Parliament, and cannot amend the Human Rights Act 1998.",
    "explanation": "The Civil Contingencies Act includes sunset mechanisms requiring prompt parliamentary approval and expressly prevents the executive from overriding the Human Rights Act by emergency decree.",
    "points": 1,
    "order_index": 25
  },
  {
    "id": "22222222-2222-4222-8222-000000000027",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Lord Hoffmann famously stated in the Belmarsh case: 'The real threat to the life of the nation, in the sense of a people living in accordance with its traditional laws and political values, comes not from terrorism but from laws such as these.' What was the central point of his reasoning?",
    "question_type": "multiple_choice",
    "options": [
      "That terrorists do not possess modern weaponry.",
      "That a free society destroys its own defining constitutional identity if it abandons fundamental civil liberties and due process in the name of security.",
      "That immigration control should be handed over to international tribunals.",
      "That the British nation was founded in the tenth century."
    ],
    "correct_answer": "That a free society destroys its own defining constitutional identity if it abandons fundamental civil liberties and due process in the name of security.",
    "explanation": "Hoffmann argued that the 'life of the nation' is not merely biological survival, but the survival of a society rooted in freedom, justice, and human rights; destroying liberties defeats the nation's essence.",
    "points": 1,
    "order_index": 26
  },
  {
    "id": "22222222-2222-4222-8222-000000000028",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following scenarios best exemplifies the constitutional writ of 'Habeas Corpus'?",
    "question_type": "multiple_choice",
    "options": [
      "A judicial order compelling a public hospital to disclose clinical mortality rates.",
      "A legal order directing a prison warden to produce a detained individual before the court and demonstrate the lawful statutory basis for their deprivation of liberty.",
      "A parliamentary resolution authorizing the appointment of three additional ombudsmen.",
      "A police warrant authorizing the search of a suspect's commercial business premises."
    ],
    "correct_answer": "A legal order directing a prison warden to produce a detained individual before the court and demonstrate the lawful statutory basis for their deprivation of liberty.",
    "explanation": "Habeas corpus is the ancient common-law writ protecting personal freedom against arbitrary detention by requiring the state to produce the prisoner and justify the legal grounds for detention.",
    "points": 1,
    "order_index": 27
  },
  {
    "id": "22222222-2222-4222-8222-000000000029",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'The First-Past-The-Post (FPTP) electoral system used in UK general elections routinely produces single-party \"manufactured majorities\" on a minority of the national popular vote.'\n\nWhat is the primary argument advanced by proponents of FPTP in defense of this system?",
    "question_type": "multiple_choice",
    "options": [
      "It ensures that minor regional parties obtain mathematical proportionality.",
      "It provides stable, decisive government with clear accountability, avoiding protracted backroom coalition negotiations.",
      "It guarantees that every voter's ballot carries identical mathematical weight across the country.",
      "It eliminates the necessity of holding periodic general elections."
    ],
    "correct_answer": "It provides stable, decisive government with clear accountability, avoiding protracted backroom coalition negotiations.",
    "explanation": "Defenders of FPTP argue that it delivers decisive executive stability and direct link between a single MP and constituency, enabling voters to easily 'kick the rascals out'.",
    "points": 1,
    "order_index": 28
  },
  {
    "id": "22222222-2222-4222-8222-000000000030",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "In a general election under FPTP, Party A wins 36% of the popular vote and 55% of the parliamentary seats. Party B wins 34% of the vote and 30% of the seats. Party C wins 18% of the vote and 2% of the seats. What democratic defect is most evident from these results?",
    "question_type": "multiple_choice",
    "options": [
      "The electoral system completely failed to count ballots cast in rural polling stations.",
      "The system creates severe vote-to-seat distortion, penalizing parties whose support is geographically dispersed while awarding an artificial working majority to a minority party.",
      "Party C had fewer campaign advertising billboards than Party A.",
      "Party B's candidates were disqualified from taking their parliamentary oaths."
    ],
    "correct_answer": "The system creates severe vote-to-seat distortion, penalizing parties whose support is geographically dispersed while awarding an artificial working majority to a minority party.",
    "explanation": "FPTP rewards concentrated regional support and heavily punishes parties with broad but non-plurality national vote share (like Party C's 18% vote translating into only 2% seats).",
    "points": 1,
    "order_index": 29
  },
  {
    "id": "22222222-2222-4222-8222-000000000031",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following statements represents an unstated assumption in the argument: 'Proportional representation (PR) is inherently superior to majoritarian systems because every vote counts equally'?",
    "question_type": "multiple_choice",
    "options": [
      "Electoral fairness is exclusively defined by exact mathematical correspondence between vote shares and parliamentary seats, rather than governmental stability or clear constituency accountability.",
      "Voters always cast ballots for independent candidates rather than political parties.",
      "Coalition governments always collapse within six months of formation.",
      "Majoritarian voting systems have been adopted by every Commonwealth member state."
    ],
    "correct_answer": "Electoral fairness is exclusively defined by exact mathematical correspondence between vote shares and parliamentary seats, rather than governmental stability or clear constituency accountability.",
    "explanation": "The assertion assumes that fairness in democracy is solely a function of proportional seat allocation, ignoring competing democratic virtues like decisive mandate and direct local representation.",
    "points": 1,
    "order_index": 30
  },
  {
    "id": "22222222-2222-4222-8222-000000000032",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Suppose a state introduces compulsory voting, fining citizens who fail to cast a ballot. What is the strongest civil libertarian objection to this policy?",
    "question_type": "multiple_choice",
    "options": [
      "Printing additional paper ballots imposes unsustainable costs on municipal budgets.",
      "Compulsory voting infringes the fundamental negative freedom of speech, which encompasses the right to remain silent and abstain from endorsing political candidates.",
      "Electoral workers would be required to work extended overtime shifts on election days.",
      "Compulsory voting always favors right-of-center conservative candidates."
    ],
    "correct_answer": "Compulsory voting infringes the fundamental negative freedom of speech, which encompasses the right to remain silent and abstain from endorsing political candidates.",
    "explanation": "Libertarians argue that freedom of political conscience includes the right not to speak or participate; forcing a citizen to vote violates their right of political abstention.",
    "points": 1,
    "order_index": 31
  },
  {
    "id": "22222222-2222-4222-8222-000000000033",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'The Parliament Acts 1911 and 1949 fundamentally altered the balance of power between the House of Commons and the House of Lords by removing the Lords' power of absolute legislative veto.'\n\nWhat is the current constitutional power of the House of Lords regarding non-money primary legislation passed by the Commons?",
    "question_type": "multiple_choice",
    "options": [
      "The Lords can amend or delay a bill for up to approximately one year, after which the Commons can pass it into law without the Lords' consent.",
      "The Lords can permanently veto any primary legislation by a simple majority vote.",
      "The Lords can dissolve the House of Commons and force a general election.",
      "The Lords have no power to suggest amendments or debate bills passed by MPs."
    ],
    "correct_answer": "The Lords can amend or delay a bill for up to approximately one year, after which the Commons can pass it into law without the Lords' consent.",
    "explanation": "Under the Parliament Acts 1911 and 1949, the House of Lords possesses only a suspensory delaying power (currently up to one year), after which the Commons may invoke the Acts to enact the bill.",
    "points": 1,
    "order_index": 32
  },
  {
    "id": "22222222-2222-4222-8222-000000000034",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "What is the 'Salisbury-Addison Convention' regarding House of Lords scrutiny?",
    "question_type": "multiple_choice",
    "options": [
      "The Lords will never hold sittings on bank holidays or during parliamentary recesses.",
      "The Lords will not reject at second or third reading any government bill that was promised in the governing party's election manifesto.",
      "The Lord Chancellor must always be chosen from hereditary peers.",
      "The Commons must accept all amendments proposed by Bishops of the Church of England."
    ],
    "correct_answer": "The Lords will not reject at second or third reading any government bill that was promised in the governing party's election manifesto.",
    "explanation": "The Salisbury Convention ensures that the unelected Upper House respects the democratic mandate of the government by not voting down bills implementing manifesto commitments.",
    "points": 1,
    "order_index": 33
  },
  {
    "id": "22222222-2222-4222-8222-000000000035",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Advocates for an appointed House of Lords argue: 'Because peers do not face re-election, they can scrutinize legislation with independent expertise and long-term wisdom, free from populist electoral pandering.' Which counter-argument most directly targets this justification?",
    "question_type": "multiple_choice",
    "options": [
      "Appointed peers often have degrees from prestigious universities.",
      "The absence of electoral accountability means appointments are vulnerable to political patronage and cronyism, lacking democratic legitimacy to alter laws passed by elected representatives.",
      "The House of Lords meets in a chamber adorned with red leather benches.",
      "Hereditary peers were partially reduced in number by the House of Lords Act 1999."
    ],
    "correct_answer": "The absence of electoral accountability means appointments are vulnerable to political patronage and cronyism, lacking democratic legitimacy to alter laws passed by elected representatives.",
    "explanation": "The central critique of unelected chambers is that appointments enable partisan patronage without democratic accountability to the populace who must obey the laws.",
    "points": 1,
    "order_index": 34
  },
  {
    "id": "22222222-2222-4222-8222-000000000036",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following statements represents an analogy commonly employed to justify bicameral scrutiny?",
    "question_type": "multiple_choice",
    "options": [
      "Pouring hot tea from the legislative cup into the cooling saucer of a revising second chamber before drinking.",
      "Building a stone fortress with two identical defensive moats.",
      "A court of law where the prosecution and defense are represented by the same barrister.",
      "A ship with two rudders turning in opposite directions."
    ],
    "correct_answer": "Pouring hot tea from the legislative cup into the cooling saucer of a revising second chamber before drinking.",
    "explanation": "George Washington's famous analogy depicted the second chamber as a cooling saucer designed to temper the impassioned, hasty legislative impulses of the lower house.",
    "points": 1,
    "order_index": 35
  },
  {
    "id": "22222222-2222-4222-8222-000000000037",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'Under the Official Secrets Act 1989, British civil servants and intelligence personnel who disclose unauthorized official information face criminal prosecution, with no statutory defense of \"public interest\".'\n\nIn R v Shayler (2002), what did the House of Lords decide regarding the absence of a public interest defense in the Official Secrets Act 1989?",
    "question_type": "multiple_choice",
    "options": [
      "The House of Lords declared the Official Secrets Act void for violating common law magna carta rights.",
      "The House of Lords held that the ban was compatible with Article 10 because an internal authorization mechanism existed for staff to raise concerns without public leaking.",
      "The House of Lords ruled that all government intelligence files must be published online after twelve months.",
      "The House of Lords acquitted Shayler and abolished the security services tribunal."
    ],
    "correct_answer": "The House of Lords held that the ban was compatible with Article 10 because an internal authorization mechanism existed for staff to raise concerns without public leaking.",
    "explanation": "The Law Lords ruled that the absence of a public interest defense was compatible with free expression because whistleblowers had internal procedures and judicial review options to seek disclosure.",
    "points": 1,
    "order_index": 36
  },
  {
    "id": "22222222-2222-4222-8222-000000000038",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "A defense whistleblower leaks classified documents proving that a government minister secretly authorized the illegal sale of chemical weapons precursors to an authoritarian regime. The whistleblower is prosecuted. What is the primary moral tension illustrated by this scenario?",
    "question_type": "multiple_choice",
    "options": [
      "The conflict between the high cost of newspaper printing and digital blog hosting.",
      "The conflict between the civil servant's legal duty of institutional loyalty and the higher ethical duty to expose catastrophic state wrongdoing to the public.",
      "Whether chemical weapon precursors should be classified as hazardous freight.",
      "The jurisdictional rivalry between metropolitan police detectives and customs officers."
    ],
    "correct_answer": "The conflict between the civil servant's legal duty of institutional loyalty and the higher ethical duty to expose catastrophic state wrongdoing to the public.",
    "explanation": "This classic whistleblowing dilemma pits contractual/statutory duties of state confidentiality against moral obligations to expose illegal government conduct that harms the public interest.",
    "points": 1,
    "order_index": 37
  },
  {
    "id": "22222222-2222-4222-8222-000000000039",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following propositions, if true, would most weaken the claim that 'strict secrecy laws are essential to protect national security'?",
    "question_type": "multiple_choice",
    "options": [
      "Foreign adversaries routinely employ electronic interception techniques against diplomatic cables.",
      "Excessive secrecy allows executive departments to conceal systemic corruption, gross negligence, and operational failures under the pretext of national security.",
      "The Ministry of Defence operates a public relations press office.",
      "Military veterans often write published memoirs after retirement."
    ],
    "correct_answer": "Excessive secrecy allows executive departments to conceal systemic corruption, gross negligence, and operational failures under the pretext of national security.",
    "explanation": "If broad secrecy shields malfeasance and incompetence rather than protecting true security, it weakens the claim that secrecy operates solely to preserve the nation's safety.",
    "points": 1,
    "order_index": 38
  },
  {
    "id": "22222222-2222-4222-8222-000000000040",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Passage Excerpt: 'The legal power to deploy armed forces overseas and declare war resides within the Royal Prerogative, exercised by the Prime Minister without statutory requirement for parliamentary assent.'\n\nWhat modern constitutional convention emerged following the 2003 Iraq War regarding military deployment?",
    "question_type": "multiple_choice",
    "options": [
      "The monarch must personally lead troops on the battlefield.",
      "A convention that Parliament (specifically the House of Commons) should be given the opportunity to debate and vote prior to significant overseas military engagement, except in sudden emergencies.",
      "Ministers must receive permission from the International Court of Justice before ordering airstrikes.",
      "Armed forces personnel may vote on whether to accept overseas deployment orders."
    ],
    "correct_answer": "A convention that Parliament (specifically the House of Commons) should be given the opportunity to debate and vote prior to significant overseas military engagement, except in sudden emergencies.",
    "explanation": "Since the 2003 Iraq debate, a convention has developed requiring parliamentary consultation and approval before committing British troops to planned combat operations overseas.",
    "points": 1,
    "order_index": 39
  },
  {
    "id": "22222222-2222-4222-8222-000000000041",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Suppose the government deploys armed drones against hostile combatants without a prior Commons vote, citing acute, imminent intelligence of an impending attack on London. Why does this deployment NOT breach the post-2003 war powers convention?",
    "question_type": "multiple_choice",
    "options": [
      "Because drone pilots are technically classified as civilian IT contractors.",
      "Because the convention explicitly provides an exception for urgent emergencies and immediate self-defense where prior debate would compromise operational efficacy.",
      "Because drones are manufactured domestically rather than imported from overseas.",
      "Because MPs were not sitting on the committee of defense."
    ],
    "correct_answer": "Because the convention explicitly provides an exception for urgent emergencies and immediate self-defense where prior debate would compromise operational efficacy.",
    "explanation": "The convention acknowledges that urgent executive action cannot wait for parliamentary debate when sudden national defense emergencies or imminent threats require instant response.",
    "points": 1,
    "order_index": 40
  },
  {
    "id": "22222222-2222-4222-8222-000000000042",
    "test_id": "22222222-2222-4222-8222-222222222222",
    "question_text": "Which of the following represents the strongest argument for codifying the Royal Prerogative into statutory law?",
    "question_type": "multiple_choice",
    "options": [
      "Prerogative powers are written in medieval Latin, which modern lawyers cannot translate.",
      "Replacing murky, unwritten monarchical powers with clear parliamentary statutes enhances democratic transparency, accountability, and the rule of law.",
      "Statutory codes are always cheaper to print than common law digests.",
      "The monarch has expressed a personal desire to retire from public appearances."
    ],
    "correct_answer": "Replacing murky, unwritten monarchical powers with clear parliamentary statutes enhances democratic transparency, accountability, and the rule of law.",
    "explanation": "Codification removes ambiguity from archaic executive powers, placing them under democratic scrutiny and establishing clear statutory boundaries defined by the elected legislature.",
    "points": 1,
    "order_index": 41
  },
  {
    "id": "33333333-3333-4333-8333-000000000001",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'Professor Tara Brabazon warned of the \"University of Google,\" where undergraduate students mistake the instant retrieval of digital search results for deep intellectual mastery. Search engine algorithms prioritize popularity, recency, and commercial SEO over peer-reviewed veracity, flattening nuanced scholarly debates into superficial soundbites.'\n\nWhat is the central epistemological critique advanced by Professor Brabazon against uncritical reliance on commercial search engines?",
    "question_type": "multiple_choice",
    "options": [
      "Search engines operate with excessive electrical power consumption.",
      "Algorithmic search mechanics confuse information retrieval with true intellectual comprehension, prioritizing commercial visibility over scholarly rigor.",
      "Google prohibits universities from accessing digital library subscriptions.",
      "Computer monitors cause physical optical fatigue in young readers."
    ],
    "correct_answer": "Algorithmic search mechanics confuse information retrieval with true intellectual comprehension, prioritizing commercial visibility over scholarly rigor.",
    "explanation": "Brabazon's critique emphasizes that commercial algorithms rank results based on click-through popularity and SEO rather than epistemic validity or methodological quality.",
    "points": 1,
    "order_index": 0
  },
  {
    "id": "33333333-3333-4333-8333-000000000002",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following phrases from the passage best captures an assertion of value (normative judgment) rather than an assertion of fact?",
    "question_type": "multiple_choice",
    "options": [
      "'Undergraduate students use search engines to locate citations.'",
      "'Commercial algorithms index billions of web pages daily.'",
      "'Mistaking speed of retrieval for intellectual mastery is a perilous degradation of scholarly standards.'",
      "'Search engines return ranked lists of web addresses.'"
    ],
    "correct_answer": "'Mistaking speed of retrieval for intellectual mastery is a perilous degradation of scholarly standards.'",
    "explanation": "Terms like 'perilous degradation' reflect a normative standard of academic quality and intellectual worth, whereas the other options describe verifiable behavioral or technical facts.",
    "points": 1,
    "order_index": 1
  },
  {
    "id": "33333333-3333-4333-8333-000000000003",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following, if true, would most strongly counter the author's skepticism toward internet search engines in undergraduate pedagogy?",
    "question_type": "multiple_choice",
    "options": [
      "Studies demonstrating that students trained in digital information literacy can evaluate conflicting online claims and discover niche academic papers far more comprehensively than prior generations restricted to small physical library shelves.",
      "Reports that internet connectivity speeds have increased tenfold across major universities.",
      "Surveys indicating that university students own both smartphones and laptops.",
      "Evidence that academic publishers charge thousands of dollars for print journal subscriptions."
    ],
    "correct_answer": "Studies demonstrating that students trained in digital information literacy can evaluate conflicting online claims and discover niche academic papers far more comprehensively than prior generations restricted to small physical library shelves.",
    "explanation": "This evidence shows that digital tools, paired with literacy, actually elevate research breadth and critical discernment beyond the limits of physical library shelves.",
    "points": 1,
    "order_index": 2
  },
  {
    "id": "33333333-3333-4333-8333-000000000004",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "What underlying assumption connects the author's critique of search engines to their broader concern regarding democratic citizenship?",
    "question_type": "multiple_choice",
    "options": [
      "Only individuals holding doctoral degrees should be permitted to vote in democratic elections.",
      "The capacity for sustained critical analysis and distinguishing evidence from assertion is necessary for responsible democratic deliberation.",
      "Democratic societies cannot survive if public libraries transition to digital card catalogues.",
      "Elected politicians never use internet search engines when formulating legislation."
    ],
    "correct_answer": "The capacity for sustained critical analysis and distinguishing evidence from assertion is necessary for responsible democratic deliberation.",
    "explanation": "Educational theorists link intellectual discernment to democratic health: citizens incapable of evaluating information critically become vulnerable to demagoguery and manipulation.",
    "points": 1,
    "order_index": 3
  },
  {
    "id": "33333333-3333-4333-8333-000000000005",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'The \"Google Effect\" (or transactive memory offloading) posits that individuals are less likely to remember factual information if they believe it will be readily retrievable online in the future. Instead of encoding the facts themselves, our neural architecture encodes the location where the facts reside.'\n\nWhat is the primary cognitive trade-off identified in this research?",
    "question_type": "multiple_choice",
    "options": [
      "Human brains are shrinking in physical volume due to screen luminescence.",
      "Long-term memory retention of factual knowledge diminishes, while the ability to locate external resources is reinforced.",
      "Individuals completely lose the ability to acquire spoken language.",
      "Students require less sleep when studying online."
    ],
    "correct_answer": "Long-term memory retention of factual knowledge diminishes, while the ability to locate external resources is reinforced.",
    "explanation": "Transactive memory theory shows that our brains adapt to external storage by prioritizing retrieval routes over internal semantic encoding.",
    "points": 1,
    "order_index": 4
  },
  {
    "id": "33333333-3333-4333-8333-000000000006",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "A critic of cognitive offloading argues: 'If human beings do not store fundamental scientific concepts in their biological working memory, they cannot perform novel creative synthesis or spot unexpected conceptual connections.' What premise does this argument depend upon?",
    "question_type": "multiple_choice",
    "options": [
      "Creative intellectual breakthroughs require synthesizing information already integrated into internal neural memory networks rather than looking up disconnected data points.",
      "Biological memory is completely infallible and never undergoes decay.",
      "External hard drives are prone to magnetic degradation over time.",
      "All major historical discoveries were made by people with photographic memories."
    ],
    "correct_answer": "Creative intellectual breakthroughs require synthesizing information already integrated into internal neural memory networks rather than looking up disconnected data points.",
    "explanation": "Creative synthesis depends on subconscious associative connections that occur between internalized knowledge structures, which cannot occur if data resides solely in external lookups.",
    "points": 1,
    "order_index": 5
  },
  {
    "id": "33333333-3333-4333-8333-000000000007",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following historical parallels most closely mirrors the contemporary anxiety regarding internet search and memory loss?",
    "question_type": "multiple_choice",
    "options": [
      "Plato's dialogue Phaedrus, in which Socrates lamented that the invention of writing would produce forgetfulness in the souls of learners by replacing internal memory with external marks.",
      "The invention of the steam locomotive, which caused passengers to worry about tunnel suffocation.",
      "The introduction of electric streetlights, which transformed urban nightlife in nineteenth-century London.",
      "The development of maritime navigation compasses during the Age of Discovery."
    ],
    "correct_answer": "Plato's dialogue Phaedrus, in which Socrates lamented that the invention of writing would produce forgetfulness in the souls of learners by replacing internal memory with external marks.",
    "explanation": "Socrates' critique of written script in Phaedrus directly parallels today's concerns: that relying on external technologies erodes human internal memory capacity.",
    "points": 1,
    "order_index": 6
  },
  {
    "id": "33333333-3333-4333-8333-000000000008",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following scenarios demonstrates an invalid deductive inference regarding cognitive offloading?",
    "question_type": "multiple_choice",
    "options": [
      "Because cognitive offloading reduces internal memorization of dates, anyone who uses a calendar app will be incapable of understanding historical cause and effect.",
      "If transactive memory relies on digital tools, losing access to those tools will temporarily impair retrieval speed.",
      "Externalizing data storage allows working memory to allocate attention to computational tasks.",
      "Relying on GPS navigation is associated with reduced hippocampal spatial mapping activation."
    ],
    "correct_answer": "Because cognitive offloading reduces internal memorization of dates, anyone who uses a calendar app will be incapable of understanding historical cause and effect.",
    "explanation": "This is a non sequitur: not memorizing specific calendar dates does not logically imply an inability to grasp causal historical mechanisms.",
    "points": 1,
    "order_index": 7
  },
  {
    "id": "33333333-3333-4333-8333-000000000009",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'Philosopher C. Thi Nguyen distinguishes between \"epistemic bubbles\" and \"echo chambers.\" An epistemic bubble is a social structure where relevant voices have been inadvertently left out, whereas an echo chamber is a culture where dissenting voices are actively brought inside, only to be systematically discredited as malicious or untrustworthy.'\n\nWhy are echo chambers significantly harder to dismantle through fact-checking than epistemic bubbles?",
    "question_type": "multiple_choice",
    "options": [
      "Because epistemic bubbles require expensive software subscriptions.",
      "Because echo chambers possess built-in belief-protection mechanisms that interpret counter-evidence and fact-checks as further proof of an external conspiracy.",
      "Because members of echo chambers never use the internet.",
      "Because echo chambers are protected by international diplomatic immunity."
    ],
    "correct_answer": "Because echo chambers possess built-in belief-protection mechanisms that interpret counter-evidence and fact-checks as further proof of an external conspiracy.",
    "explanation": "Echo chambers pre-emptively undermine outside authorities, so presenting conflicting facts actually reinforces belief in the conspiracy by confirming that 'the establishment is lying'.",
    "points": 1,
    "order_index": 8
  },
  {
    "id": "33333333-3333-4333-8333-000000000010",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "What role does algorithmic personalization in social media feeds play in fostering epistemic insularity?",
    "question_type": "multiple_choice",
    "options": [
      "It randomly scrambles user passwords every twenty-four hours.",
      "It optimizes for user engagement and screen-time by serving content that confirms existing ideological biases, gradually filtering out disconfirming viewpoints.",
      "It requires all users to take a standardized grammar examination before posting.",
      "It translates international news stories into a single universal language."
    ],
    "correct_answer": "It optimizes for user engagement and screen-time by serving content that confirms existing ideological biases, gradually filtering out disconfirming viewpoints.",
    "explanation": "Personalization algorithms maximize engagement by serving confirmatory and outrage-inducing material, systematically hiding alternative perspectives from user feeds.",
    "points": 1,
    "order_index": 9
  },
  {
    "id": "33333333-3333-4333-8333-000000000011",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following best exemplifies the 'confirmation bias' phenomenon in student digital research?",
    "question_type": "multiple_choice",
    "options": [
      "A student searching 'why climate change is a hoax' and reading exclusively links from blogs confirming their skepticism, while ignoring scientific consensus reports.",
      "A student comparing three different peer-reviewed journal articles before writing an essay.",
      "A student quoting an encyclopedia entry on ancient Mesopotamian agriculture.",
      "A student submitting an essay twelve hours before the assigned deadline."
    ],
    "correct_answer": "A student searching 'why climate change is a hoax' and reading exclusively links from blogs confirming their skepticism, while ignoring scientific consensus reports.",
    "explanation": "Confirmation bias is the tendency to seek out, interpret, and favor information that validates pre-existing beliefs while ignoring contrary evidence.",
    "points": 1,
    "order_index": 10
  },
  {
    "id": "33333333-3333-4333-8333-000000000012",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Suppose a social network redesigns its algorithm to expose users to equal numbers of opposing political viewpoints. Studies show that when exposed to extreme opposing arguments, partisan users become even more polarized. What cognitive phenomenon explains this outcome?",
    "question_type": "multiple_choice",
    "options": [
      "Sensory sensory adaptation.",
      "The 'backfire effect' or reactive defensive identity polarization.",
      "Linguistic determinism.",
      "Retroactive inhibition in motor learning."
    ],
    "correct_answer": "The 'backfire effect' or reactive defensive identity polarization.",
    "explanation": "When identity-threatening opposing views are presented aggressively, individuals entrench themselves deeper into their tribe to defend their social identity.",
    "points": 1,
    "order_index": 11
  },
  {
    "id": "33333333-3333-4333-8333-000000000013",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'Large Language Models (LLMs) synthesize fluent, grammatically flawless prose by predicting statistical word probabilities across colossal text corpora. However, they lack semantic grounding, genuine intentionality, and moral accountability.'\n\nWhat is the fundamental pedagogical concern when students submit AI-generated text as their own original essays?",
    "question_type": "multiple_choice",
    "options": [
      "The essay uses too many syllables per paragraph.",
      "The student bypasses the arduous intellectual struggle of formulating, structuring, and defending their own thoughts, thereby failing to develop cognitive autonomy.",
      "The university servers will suffer mechanical wear and tear.",
      "Printers in the university library will run out of toner."
    ],
    "correct_answer": "The student bypasses the arduous intellectual struggle of formulating, structuring, and defending their own thoughts, thereby failing to develop cognitive autonomy.",
    "explanation": "The purpose of essay writing is the cognitive development inherent in wrestling with complex ideas; outsourcing this to an LLM voids the primary learning mechanism.",
    "points": 1,
    "order_index": 12
  },
  {
    "id": "33333333-3333-4333-8333-000000000014",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Why is the reliance on automated 'AI detectors' deeply problematic for university disciplinary tribunals?",
    "question_type": "multiple_choice",
    "options": [
      "Detectors operate with high false-positive rates that disproportionately flag non-native English speakers who use structured, formulaic prose.",
      "Detectors consume excessive bandwidth on university Wi-Fi networks.",
      "Detectors are prohibited under the Geneva Conventions.",
      "Detectors cannot read text written in times new roman font."
    ],
    "correct_answer": "Detectors operate with high false-positive rates that disproportionately flag non-native English speakers who use structured, formulaic prose.",
    "explanation": "Studies demonstrate that probabilistic AI detection tools exhibit significant false-positive rates, particularly penalizing international students whose writing is formal and predictable.",
    "points": 1,
    "order_index": 13
  },
  {
    "id": "33333333-3333-4333-8333-000000000015",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "An educator argues: 'Attempting to ban generative AI in universities is as futile and short-sighted as attempting to ban pocket calculators in mathematics classrooms sixty years ago.' What is the underlying premise of this analogy?",
    "question_type": "multiple_choice",
    "options": [
      "Calculators and language models were invented by the exact same engineers.",
      "New computational tools inevitably shift educational emphasis from manual low-level production to higher-order critical evaluation and problem conception.",
      "Calculators were banned by federal legislation in 1965.",
      "Both tools require lithium-ion battery replacements."
    ],
    "correct_answer": "New computational tools inevitably shift educational emphasis from manual low-level production to higher-order critical evaluation and problem conception.",
    "explanation": "The analogy assumes that just as calculators freed students from manual arithmetic to focus on advanced mathematical logic, AI should shift focus from drafting to critical reasoning.",
    "points": 1,
    "order_index": 14
  },
  {
    "id": "33333333-3333-4333-8333-000000000016",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following propositions represents a category error regarding large language models?",
    "question_type": "multiple_choice",
    "options": [
      "The language model exhibits malicious personal jealousy toward rival software systems.",
      "The language model was trained on billions of parameters using gradient descent.",
      "The language model outputs text via token prediction.",
      "The language model consumes electrical energy during inference."
    ],
    "correct_answer": "The language model exhibits malicious personal jealousy toward rival software systems.",
    "explanation": "Attributing subjective emotional states like 'jealousy' to a non-conscious statistical token prediction model is a category error (attributing human mental qualities to a mathematical algorithm).",
    "points": 1,
    "order_index": 15
  },
  {
    "id": "33333333-3333-4333-8333-000000000017",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'The shift toward high tuition fees has recast higher education as a private market commodity rather than a public social good, transforming students into consumers who demand frictionless credentialism rather than rigorous intellectual challenge.'\n\nAccording to critics, how does the 'student-as-consumer' model undermine university pedagogy?",
    "question_type": "multiple_choice",
    "options": [
      "It forces university cafeterias to offer too many food options.",
      "It pressures academic departments to inflate grades and dilute curriculum rigor to maintain positive customer satisfaction metrics.",
      "It requires professors to dress in business attire during lectures.",
      "It prevents universities from participating in competitive rowing regattas."
    ],
    "correct_answer": "It pressures academic departments to inflate grades and dilute curriculum rigor to maintain positive customer satisfaction metrics.",
    "explanation": "When students are treated as paying customers, student evaluations and retention metrics incentivize institutions to avoid discomforting academic rigor in favor of customer satisfaction.",
    "points": 1,
    "order_index": 16
  },
  {
    "id": "33333333-3333-4333-8333-000000000018",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following arguments best defends the student-fee funding model over state-funded free tuition from an egalitarian perspective?",
    "question_type": "multiple_choice",
    "options": [
      "Higher tuition fees make students read textbooks more quickly.",
      "Because university graduates earn substantially higher lifetime incomes than non-graduates, funding higher education entirely from general taxation forces non-graduate workers to subsidize future high earners.",
      "Private universities are exempt from local property taxation.",
      "Professors teach more effectively when receiving private endowments."
    ],
    "correct_answer": "Because university graduates earn substantially higher lifetime incomes than non-graduates, funding higher education entirely from general taxation forces non-graduate workers to subsidize future high earners.",
    "explanation": "This is the progressive critique of universal state funding: funding higher education from general taxes acts as a regressive redistribution from working-class non-graduates to upwardly mobile graduates.",
    "points": 1,
    "order_index": 17
  },
  {
    "id": "33333333-3333-4333-8333-000000000019",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "What is an unstated assumption in the claim: 'Universities that do not produce graduates with high starting salaries within six months are failing their educational mission'?",
    "question_type": "multiple_choice",
    "options": [
      "The sole or primary legitimate purpose of higher education is immediate short-term vocational earning power in the commercial labor market.",
      "Graduate salaries are calculated before national insurance deductions.",
      "All university graduates work in metropolitan finance hubs.",
      "Science degrees require four years of laboratory coursework."
    ],
    "correct_answer": "The sole or primary legitimate purpose of higher education is immediate short-term vocational earning power in the commercial labor market.",
    "explanation": "The metric of short-term starting salary assumes that non-monetary goods—such as democratic citizenship, philosophical reflection, and artistic development—are negligible educational purposes.",
    "points": 1,
    "order_index": 18
  },
  {
    "id": "33333333-3333-4333-8333-000000000020",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following statements represents an empirical economic observation rather than a normative educational claim?",
    "question_type": "multiple_choice",
    "options": [
      "Higher education institutions ought to prioritize civic virtue over corporate employability.",
      "Over the past twenty-five years, university administrative expenditure grew at twice the rate of academic teaching expenditure.",
      "It is unacceptable that university rectors earn ten times the salary of maintenance staff.",
      "Knowledge should be pursued exclusively for its own intrinsic beauty."
    ],
    "correct_answer": "Over the past twenty-five years, university administrative expenditure grew at twice the rate of academic teaching expenditure.",
    "explanation": "This is a measurable, verifiable empirical statement about budgetary allocations over time, free of moral prescriptive terms ('ought', 'unacceptable').",
    "points": 1,
    "order_index": 19
  },
  {
    "id": "33333333-3333-4333-8333-000000000021",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'Oligopolistic commercial academic publishers enjoy profit margins exceeding thirty percent by monetizing research funded by public taxpayers, performed by salaried academics, and peer-reviewed for free by other academics.'\n\nWhat is the central ethical argument for mandatory 'Open Access' publishing of scientific research?",
    "question_type": "multiple_choice",
    "options": [
      "Publishers should be forced to replace journal editors with artificial intelligence.",
      "Research funded by the public should be freely accessible to the public, scientists, and developing countries, rather than locked behind corporate paywalls.",
      "Scientific papers should be limited to a maximum length of five hundred words.",
      "Academics should be prohibited from publishing research outside their home country."
    ],
    "correct_answer": "Research funded by the public should be freely accessible to the public, scientists, and developing countries, rather than locked behind corporate paywalls.",
    "explanation": "The moral foundation of Open Access is distributive justice: because taxpayers financed the inquiry, the resulting scientific knowledge is a common public good.",
    "points": 1,
    "order_index": 20
  },
  {
    "id": "33333333-3333-4333-8333-000000000022",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "How does the 'Author-Pays' model (Article Processing Charges - APCs) for open access create a new form of epistemic inequality?",
    "question_type": "multiple_choice",
    "options": [
      "It makes academic papers print in black and white rather than color.",
      "While it allows everyone to read research for free, it creates a severe financial barrier preventing researchers from underfunded institutions or the Global South from publishing their work.",
      "It forces researchers to deliver oral presentations at every major conference.",
      "It leads universities to cancel campus bookstore contracts."
    ],
    "correct_answer": "While it allows everyone to read research for free, it creates a severe financial barrier preventing researchers from underfunded institutions or the Global South from publishing their work.",
    "explanation": "APCs shift the paywall from the reader to the author: well-funded elite universities can easily pay $3,000 APCs, whereas researchers in developing nations are financially excluded from publishing.",
    "points": 1,
    "order_index": 21
  },
  {
    "id": "33333333-3333-4333-8333-000000000023",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following, if true, would best defend commercial academic publishers against accusations of rent-seeking exploitation?",
    "question_type": "multiple_choice",
    "options": [
      "Commercial publishers manage long-term digital preservation, coordinate complex peer-review software ecosystems, format technical data standards, and protect legal copyright integrity.",
      "Commercial publishers sponsor annual cocktail receptions at academic conferences.",
      "Most journal editors have published at least one novel.",
      "Publishers employ marketing interns during the summer months."
    ],
    "correct_answer": "Commercial publishers manage long-term digital preservation, coordinate complex peer-review software ecosystems, format technical data standards, and protect legal copyright integrity.",
    "explanation": "This counter-argument identifies real technical, infrastructural, and administrative value added by publishers beyond simply hosting raw texts.",
    "points": 1,
    "order_index": 22
  },
  {
    "id": "33333333-3333-4333-8333-000000000024",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "What is meant by the concept of 'Sci-Hub' and shadow libraries acting as 'guerrilla open access'?",
    "question_type": "multiple_choice",
    "options": [
      "Libraries that operate exclusively inside underground military bunkers.",
      "Websites that bypass commercial paywalls through illicit scraping and user-donated credentials to provide universal, unauthorized access to scientific literature.",
      "Student clubs that exchange second-hand physical textbooks.",
      "Mobile library buses operating in rural farming villages."
    ],
    "correct_answer": "Websites that bypass commercial paywalls through illicit scraping and user-donated credentials to provide universal, unauthorized access to scientific literature.",
    "explanation": "Shadow libraries like Sci-Hub use unauthorized civil disobedience tactics to liberate paywalled academic papers, arguing that scientific knowledge belongs to all humanity.",
    "points": 1,
    "order_index": 23
  },
  {
    "id": "33333333-3333-4333-8333-000000000025",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'The abrupt pivot to remote emergency schooling during the pandemic shattered the technocratic utopian myth that digital connectivity is an automatic equalizer. Instead, it accentuated the \"digital divide,\" where disparities in hardware access, high-speed broadband, and quiet domestic study environments compounded educational stratification.'\n\nWhy did remote online learning exacerbate educational inequality along socio-economic lines?",
    "question_type": "multiple_choice",
    "options": [
      "Because affluent households possessed private devices, high-speed connections, and quiet study spaces, while disadvantaged students faced shared devices, unstable connectivity, and overcrowding.",
      "Because video conferencing applications charge students an hourly connection fee.",
      "Because teachers only graded assignments submitted by students wearing school uniforms on webcam.",
      "Because computer screens cannot display algebraic symbols accurately."
    ],
    "correct_answer": "Because affluent households possessed private devices, high-speed connections, and quiet study spaces, while disadvantaged students faced shared devices, unstable connectivity, and overcrowding.",
    "explanation": "Digital learning relies heavily on domestic physical and economic infrastructure; unequal access to quiet space, stable internet, and dedicated laptops widened learning gaps.",
    "points": 1,
    "order_index": 24
  },
  {
    "id": "33333333-3333-4333-8333-000000000026",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following interventions most directly addresses the 'second-level digital divide' (inequality in digital skills and mentoring) rather than the 'first-level digital divide' (hardware access)?",
    "question_type": "multiple_choice",
    "options": [
      "Distributing refurbished tablet computers to all low-income households.",
      "Providing intensive digital media literacy tutoring and critical inquiry coaching to disadvantaged students.",
      "Laying fiber-optic internet cables in rural municipalities.",
      "Subsidizing the monthly electrical utility bills of public schools."
    ],
    "correct_answer": "Providing intensive digital media literacy tutoring and critical inquiry coaching to disadvantaged students.",
    "explanation": "The first-level divide is material access (hardware/broadband); the second-level divide concerns capabilities, media literacy, discernment, and pedagogical mentoring.",
    "points": 1,
    "order_index": 25
  },
  {
    "id": "33333333-3333-4333-8333-000000000027",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "An advocate for asynchronous remote higher education claims: 'Pre-recorded video lectures render physical campus universities obsolete.' Which assumption does this claim rely upon?",
    "question_type": "multiple_choice",
    "options": [
      "The value of higher education consists entirely of unidirectional lecture content delivery, rather than spontaneous discussion, peer collaboration, laboratories, and socialization.",
      "Video cameras capture better lighting than lecture theatre chandeliers.",
      "All university professors have professional television broadcasting experience.",
      "Students prefer watching lectures at normal speed rather than double speed."
    ],
    "correct_answer": "The value of higher education consists entirely of unidirectional lecture content delivery, rather than spontaneous discussion, peer collaboration, laboratories, and socialization.",
    "explanation": "The claim reduces university learning to passive reception of lecture videos, ignoring collaborative seminar debate, lab mentoring, peer networking, and personal growth.",
    "points": 1,
    "order_index": 26
  },
  {
    "id": "33333333-3333-4333-8333-000000000028",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following propositions represents a sound deductive syllogism?",
    "question_type": "multiple_choice",
    "options": [
      "All students who lack broadband access struggle with remote exams. Marcus has broadband access. Therefore, Marcus does not struggle with remote exams.",
      "All students who lack broadband access struggle with remote exams. Marcus lacks broadband access. Therefore, Marcus struggles with remote exams.",
      "Some students who lack broadband access struggle with remote exams. Marcus is a student. Therefore, Marcus lacks broadband access.",
      "Marcus struggles with remote exams. Therefore, Marcus lacks broadband access."
    ],
    "correct_answer": "All students who lack broadband access struggle with remote exams. Marcus lacks broadband access. Therefore, Marcus struggles with remote exams.",
    "explanation": "This is a valid modus ponens deduction: All A have property B; Marcus is A; therefore Marcus has property B. The first option commits the fallacy of denying the antecedent.",
    "points": 1,
    "order_index": 27
  },
  {
    "id": "33333333-3333-4333-8333-000000000029",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'Goodhart's Law observes that \"when a measure becomes a target, it ceases to be a good measure.\" In education, metric-fixation transforms teaching into test-coaching, where teachers are coerced into \"teaching to the test\" at the expense of genuine intellectual curiosity.'\n\nHow does Goodhart's Law manifest in high-stakes standardized school testing?",
    "question_type": "multiple_choice",
    "options": [
      "Schools spend excessive funds on number 2 pencils.",
      "Schools prioritize superficial test-taking algorithms and memorization tricks that boost test scores without improving students' underlying subject comprehension.",
      "Examiners refuse to grade handwritten exam booklets.",
      "Students demand longer summer vacation intervals."
    ],
    "correct_answer": "Schools prioritize superficial test-taking algorithms and memorization tricks that boost test scores without improving students' underlying subject comprehension.",
    "explanation": "When test scores become the sole metric for school funding and teacher evaluation, efforts shift to gaming the metric (test coaching) rather than fostering real conceptual understanding.",
    "points": 1,
    "order_index": 28
  },
  {
    "id": "33333333-3333-4333-8333-000000000030",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Paulo Freire famously critiqued the 'banking model' of education. What does this critique reject?",
    "question_type": "multiple_choice",
    "options": [
      "Allowing students to open commercial bank checking accounts.",
      "Treating students as passive, empty receptacles into whom teachers deposit pre-packaged fragments of static knowledge.",
      "Using electronic calculators in accounting examinations.",
      "Requiring university bursars to publish annual balance sheets."
    ],
    "correct_answer": "Treating students as passive, empty receptacles into whom teachers deposit pre-packaged fragments of static knowledge.",
    "explanation": "Freire's 'banking model' critique targets pedagogy that treats learners as passive recipients of deposited facts rather than active co-creators of critical knowledge.",
    "points": 1,
    "order_index": 29
  },
  {
    "id": "33333333-3333-4333-8333-000000000031",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following represents the strongest defense of objective standardized testing in educational policy?",
    "question_type": "multiple_choice",
    "options": [
      "Standardized testing eliminates the need to teach reading comprehension.",
      "Standardized testing provides an impartial, transparent yardstick that reduces subjective grading bias and enables detection of systemic resource deficiencies across diverse schools.",
      "Standardized tests take less than ten minutes to administer.",
      "All questions on standardized tests are written by students themselves."
    ],
    "correct_answer": "Standardized testing provides an impartial, transparent yardstick that reduces subjective grading bias and enables detection of systemic resource deficiencies across diverse schools.",
    "explanation": "Proponents argue that standardized exams provide an objective benchmark free from subjective teacher favoritism, highlighting institutional inequalities for targeted intervention.",
    "points": 1,
    "order_index": 30
  },
  {
    "id": "33333333-3333-4333-8333-000000000032",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "An educational reformer states: 'Because testing causes psychological stress among teenagers, all school examinations should be permanently abolished.' What is the primary logical flaw in this proposal?",
    "question_type": "multiple_choice",
    "options": [
      "It assumes that all stress is inherently bad and fails to consider how assessments provide essential feedback and motivation for skill mastery.",
      "It uses the word 'examination' when it should use 'interrogation'.",
      "It ignores the fact that printers generate test booklets on recycled paper.",
      "It assumes that teenagers enjoy studying during the evening."
    ],
    "correct_answer": "It assumes that all stress is inherently bad and fails to consider how assessments provide essential feedback and motivation for skill mastery.",
    "explanation": "The argument overreacts by eliminating the tool entirely, overlooking the vital diagnostic and developmental functions of assessment that could be reformed rather than abolished.",
    "points": 1,
    "order_index": 31
  },
  {
    "id": "33333333-3333-4333-8333-000000000033",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'Commercial educational software platforms routinely track keystrokes, webcam eye movements, browsing histories, and behavioral response latencies under the guise of \"learning analytics\" and remote proctoring.'\n\nWhat is the primary civil libertarian concern regarding remote exam proctoring algorithms that track eye gaze and facial expressions?",
    "question_type": "multiple_choice",
    "options": [
      "The software makes laptops deplete their battery power within three hours.",
      "The software normalizes invasive biometric surveillance and punishes neurodivergent students whose involuntary movements are misflagged as academic cheating.",
      "Webcams produce blurry video during evening testing sessions.",
      "Students might wear hats that conceal their headphones."
    ],
    "correct_answer": "The software normalizes invasive biometric surveillance and punishes neurodivergent students whose involuntary movements are misflagged as academic cheating.",
    "explanation": "Automated biometric proctoring infringes privacy and discriminates against neurodivergent or anxious students whose eye movements deviate from rigid algorithmic 'normalcy'.",
    "points": 1,
    "order_index": 32
  },
  {
    "id": "33333333-3333-4333-8333-000000000034",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Under the UK General Data Protection Regulation (GDPR), on what legal basis can schools justify deploying educational software that processes student behavioral data?",
    "question_type": "multiple_choice",
    "options": [
      "Software companies have an absolute right to monetize student data.",
      "The processing must have a lawful basis (such as public task or explicit informed consent) and must comply with data minimization and purpose limitation principles.",
      "Schools are exempt from all international and domestic data protection legislation.",
      "Parents surrender all rights over their children's data when enrolling in state schools."
    ],
    "correct_answer": "The processing must have a lawful basis (such as public task or explicit informed consent) and must comply with data minimization and purpose limitation principles.",
    "explanation": "Under GDPR, public educational institutions must establish a lawful basis (like public interest task), collect only strictly necessary data, and prohibit commercial exploitation.",
    "points": 1,
    "order_index": 33
  },
  {
    "id": "33333333-3333-4333-8333-000000000035",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "What is meant by the phrase 'surveillance capitalism' when applied to EdTech companies offering 'free' digital classroom tools?",
    "question_type": "multiple_choice",
    "options": [
      "The business model of extracting behavioral data from student interactions to build predictive behavioral profiles for targeted commercial advertising and algorithmic training.",
      "The purchase of physical security cameras for school parking lots.",
      "A government program providing free school breakfasts to elementary pupils.",
      "The practice of paying teachers with corporate stock options."
    ],
    "correct_answer": "The business model of extracting behavioral data from student interactions to build predictive behavioral profiles for targeted commercial advertising and algorithmic training.",
    "explanation": "Shoshana Zuboff's concept of surveillance capitalism describes turning user interaction data into proprietary behavioral surplus to predict and shape future behavior.",
    "points": 1,
    "order_index": 34
  },
  {
    "id": "33333333-3333-4333-8333-000000000036",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following propositions represents an empirical assertion rather than an ethical evaluation?",
    "question_type": "multiple_choice",
    "options": [
      "Student biometric tracking is an intolerable invasion of childhood privacy.",
      "Over sixty percent of public school districts in the survey utilize learning management software that shares student metadata with third-party advertising brokers.",
      "Schools ought to ban all commercial technology providers from primary classrooms.",
      "It is unethical for tech corporations to profit from adolescent digital interactions."
    ],
    "correct_answer": "Over sixty percent of public school districts in the survey utilize learning management software that shares student metadata with third-party advertising brokers.",
    "explanation": "This is a factual, statistically verifiable observation about software deployment, whereas the others contain normative ethical assertions ('intolerable', 'ought', 'unethical').",
    "points": 1,
    "order_index": 35
  },
  {
    "id": "33333333-3333-4333-8333-000000000037",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'Governments worldwide systematically reallocate university funding away from the humanities toward STEM disciplines, arguing that national competitiveness requires software engineers and biochemists rather than historians and philosophers.'\n\nWhat is the central counter-argument advanced in defense of humanistic disciplines in a technological society?",
    "question_type": "multiple_choice",
    "options": [
      "Philosophy books are printed on cheaper paper than biology textbooks.",
      "Humanities foster ethical reasoning, historical contextualization, and narrative critique—capacities indispensable for governing the existential risks and social dilemmas posed by technological development.",
      "Software engineers earn lower median salaries than classical Greek scholars.",
      "Ancient languages provide better mental exercise than learning Python code."
    ],
    "correct_answer": "Humanities foster ethical reasoning, historical contextualization, and narrative critique—capacities indispensable for governing the existential risks and social dilemmas posed by technological development.",
    "explanation": "Humanities provide the critical, ethical, and historical frameworks needed to ask what technologies should be built and how they should be governed for human flourishing.",
    "points": 1,
    "order_index": 36
  },
  {
    "id": "33333333-3333-4333-8333-000000000038",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following demonstrates the fallacy of 'false precision' in educational policy?",
    "question_type": "multiple_choice",
    "options": [
      "Calculating that an English Literature degree produces exactly £14,219.43 less economic value to GDP over a lifetime than a Computer Science degree.",
      "Conducting a national census of school library book collections.",
      "Surveying teachers regarding classroom ventilation quality.",
      "Publishing the median graduation rates of regional polytechnics."
    ],
    "correct_answer": "Calculating that an English Literature degree produces exactly £14,219.43 less economic value to GDP over a lifetime than a Computer Science degree.",
    "explanation": "False precision occurs when numerical data is presented with exact decimal precision to convey scientific authority, despite relying on highly speculative, uncertain long-term assumptions.",
    "points": 1,
    "order_index": 37
  },
  {
    "id": "33333333-3333-4333-8333-000000000039",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "An economic planner argues: 'Because tech companies generate 40% of corporate tax revenues, all university funding should be redirected exclusively into coding bootcamps.' What is the most significant flaw in this argument?",
    "question_type": "multiple_choice",
    "options": [
      "It assumes that coding skills remain static and immune to automation, while ignoring the complementary roles of design, law, management, and ethical oversight in technology ecosystems.",
      "It ignores the fact that computer keyboards are manufactured in East Asia.",
      "It presumes that university classrooms are larger than lecture halls.",
      "It assumes that tax revenues are deposited into sovereign wealth accounts."
    ],
    "correct_answer": "It assumes that coding skills remain static and immune to automation, while ignoring the complementary roles of design, law, management, and ethical oversight in technology ecosystems.",
    "explanation": "The argument suffers from severe tunnel vision: coding is easily automated by AI, and tech industries depend on legal, organizational, communicative, and ethical capabilities.",
    "points": 1,
    "order_index": 38
  },
  {
    "id": "33333333-3333-4333-8333-000000000040",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Passage Excerpt: 'The Internet Archive's \"National Emergency Library\" during the 2020 lockdowns removed waitlists for scanned physical books, leading major commercial publishers to sue for copyright infringement under Hachette v. Internet Archive.'\n\nWhat was the federal court's primary rationale for rejecting the Internet Archive's \"fair use\" defense?",
    "question_type": "multiple_choice",
    "options": [
      "The court held that libraries are prohibited from operating websites.",
      "Scanning whole print books and distributing unrestricted digital copies without paying licensing fees competes directly with established commercial e-book markets, exceeding statutory fair use boundaries.",
      "The court concluded that print books should never be converted into digital PDF files.",
      "The court held that authors do not possess property rights in written words."
    ],
    "correct_answer": "Scanning whole print books and distributing unrestricted digital copies without paying licensing fees competes directly with established commercial e-book markets, exceeding statutory fair use boundaries.",
    "explanation": "The court held that mass digitization of entire books for public distribution without licenses supplanted the publishers' authorized commercial e-book licensing market.",
    "points": 1,
    "order_index": 39
  },
  {
    "id": "33333333-3333-4333-8333-000000000041",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "What is the defining distinction between 'Controlled Digital Lending' (CDL) and unrestricted digital pirating?",
    "question_type": "multiple_choice",
    "options": [
      "CDL maintains an 'owned-to-loaned' ratio, circulating only as many digital copies as the library physically purchased and holds in quarantine, whereas piracy creates infinite simultaneous copies.",
      "CDL requires readers to pay a fee of fifty dollars per page.",
      "CDL applies only to books published before the eighteenth century.",
      "Piracy is legally authorized in municipal public libraries."
    ],
    "correct_answer": "CDL maintains an 'owned-to-loaned' ratio, circulating only as many digital copies as the library physically purchased and holds in quarantine, whereas piracy creates infinite simultaneous copies.",
    "explanation": "CDL seeks to replicate print lending digitally by ensuring that each loaned digital file corresponds to an actual purchased print copy kept offline and unread.",
    "points": 1,
    "order_index": 40
  },
  {
    "id": "33333333-3333-4333-8333-000000000042",
    "test_id": "33333333-3333-4333-8333-333333333333",
    "question_text": "Which of the following propositions best summarizes the constitutional objective of copyright law as originally articulated in the Statute of Anne (1710)?",
    "question_type": "multiple_choice",
    "options": [
      "To guarantee perpetual inherited wealth for corporate publishing dynasties.",
      "To encourage learning and the creation of useful works by granting authors a limited temporary monopoly, balancing creator incentives with public access.",
      "To enable the monarch to censor dissenting theological treatises.",
      "To maximize the international export value of printed parchment."
    ],
    "correct_answer": "To encourage learning and the creation of useful works by granting authors a limited temporary monopoly, balancing creator incentives with public access.",
    "explanation": "Copyright was conceived not as an absolute natural property right, but as a balanced statutory bargain: grant authors a limited monopoly to incentivize creation, then return works to the public domain.",
    "points": 1,
    "order_index": 41
  },
  {
    "id": "44444444-4444-4444-8444-000000000001",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'In their seminal 1946 essay \"The Intentional Fallacy,\" W.K. Wimsatt and Monroe Beardsley argued that the design or intention of the author is neither available nor desirable as a standard for judging the success of a work of literary art. A poem does not come into existence by accident, but once published, it belongs to the public and embodies its own internal linguistic autonomy.'\n\nWhat is the primary thesis of the 'Intentional Fallacy' doctrine in literary criticism?",
    "question_type": "multiple_choice",
    "options": [
      "Authors always deliberately mislead their readers regarding their personal biographies.",
      "A literary text's meaning and aesthetic value must be judged from the internal evidence of the text itself, rather than from external speculations about the author's psychological intentions.",
      "Poems should only be analyzed by readers who have interviewed the poet in person.",
      "Literary works written before the twentieth century possess no verifiable aesthetic value."
    ],
    "correct_answer": "A literary text's meaning and aesthetic value must be judged from the internal evidence of the text itself, rather than from external speculations about the author's psychological intentions.",
    "explanation": "Wimsatt and Beardsley argued that looking to an author's private mental state confuses the cause of a poem with the poem itself; textual meaning resides in the public linguistic artifact.",
    "points": 1,
    "order_index": 0
  },
  {
    "id": "44444444-4444-4444-8444-000000000002",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Roland Barthes declared in 1967 that 'the birth of the reader must be at the cost of the death of the Author.' What does Barthes mean by this metaphorical declaration?",
    "question_type": "multiple_choice",
    "options": [
      "Literary critics should actively discourage living writers from publishing new novels.",
      "Meaning is not a fixed, singular essence deposited by an authorial god, but a dynamic, plural construction forged by the reader engaging with language.",
      "Readers must memorize an author's obituary before analyzing their poems.",
      "Authors lose their legal copyright protections as soon as a book is printed."
    ],
    "correct_answer": "Meaning is not a fixed, singular essence deposited by an authorial god, but a dynamic, plural construction forged by the reader engaging with language.",
    "explanation": "Barthes argued against author-centric tyranny: a text is a multidimensional space of citations and language whose unity is realized not in its origin (the author), but in its destination (the reader).",
    "points": 1,
    "order_index": 1
  },
  {
    "id": "44444444-4444-4444-8444-000000000003",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following, if true, would pose the most direct challenge to the New Critical insistence that external authorial intent is irrelevant?",
    "question_type": "multiple_choice",
    "options": [
      "Satirical texts and irony cannot be reliably identified without understanding the author's historical context and targets, since a purely literal reading would misinterpret the work's fundamental meaning.",
      "Poets frequently write drafts on lined notebook paper.",
      "Literary criticism is taught in modern university literature departments.",
      "Many famous novels were rejected by multiple publishing houses before publication."
    ],
    "correct_answer": "Satirical texts and irony cannot be reliably identified without understanding the author's historical context and targets, since a purely literal reading would misinterpret the work's fundamental meaning.",
    "explanation": "Irony and satire (e.g., Swift's 'A Modest Proposal') require knowing that the author intended the opposite of the literal words; without authorial communicative intent, satire collapses into monstrous assertion.",
    "points": 1,
    "order_index": 2
  },
  {
    "id": "44444444-4444-4444-8444-000000000004",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following phrases represents an assertion of aesthetic judgment rather than an empirical textual description?",
    "question_type": "multiple_choice",
    "options": [
      "'The sonnet consists of fourteen lines written in iambic pentameter.'",
      "'The protagonist's tragic demise evokes an unmatched sublime catharsis that elevates the drama into masterpiece status.'",
      "'The author published the manuscript in London in 1818.'",
      "'The third stanza contains an explicit rhyme scheme of ABAB.'"
    ],
    "correct_answer": "'The protagonist's tragic demise evokes an unmatched sublime catharsis that elevates the drama into masterpiece status.'",
    "explanation": "Describing an emotional effect as 'unmatched sublime catharsis' and declaring it a 'masterpiece' is a subjective aesthetic evaluation, whereas line counts, dates, and rhyme schemes are empirical facts.",
    "points": 1,
    "order_index": 3
  },
  {
    "id": "44444444-4444-4444-8444-000000000005",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'David Hume, in \"Of the Standard of Taste,\" acknowledged that beauty is no quality in things themselves: it exists merely in the mind which contemplates them. Yet Hume simultaneously rejected vulgar relativism, observing that someone who preferred Ogilby to Milton would be universally regarded as absurd.'\n\nHow did Hume reconcile the subjectivity of aesthetic sentiment with the existence of a durable 'Standard of Taste'?",
    "question_type": "multiple_choice",
    "options": [
      "By establishing a government ministry of literary censorship.",
      "By identifying ideal critics who possess delicate sentiment, practiced discernment, freedom from prejudice, and wide comparative experience across artistic traditions.",
      "By declaring that expensive artworks are objectively superior to affordable artworks.",
      "By calculating the average mathematical syllables of popular ballads."
    ],
    "correct_answer": "By identifying ideal critics who possess delicate sentiment, practiced discernment, freedom from prejudice, and wide comparative experience across artistic traditions.",
    "explanation": "Hume's solution was the 'joint verdict of true judges': though sentiment is subjective, experienced critics with refined faculties and freedom from bias provide the standard of taste.",
    "points": 1,
    "order_index": 4
  },
  {
    "id": "44444444-4444-4444-8444-000000000006",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Immanuel Kant argued in Critique of Judgment that aesthetic judgments make a claim to 'subjective universality.' What is meant by this paradox?",
    "question_type": "multiple_choice",
    "options": [
      "Everyone in the universe speaks the same native aesthetic language.",
      "When we declare an artwork beautiful, we base the judgment on personal feeling, yet we legitimately demand that all other rational beings ought to share that feeling.",
      "Universal beauty is measured by astronomical planetary alignments.",
      "Artists must sign legal treaties promising to please all international viewers."
    ],
    "correct_answer": "When we declare an artwork beautiful, we base the judgment on personal feeling, yet we legitimately demand that all other rational beings ought to share that feeling.",
    "explanation": "Kant held that aesthetic pleasure is disinterested; because it does not depend on private idiosyncratic desires, the speaker speaks as if beauty were an objective property commanding universal assent.",
    "points": 1,
    "order_index": 5
  },
  {
    "id": "44444444-4444-4444-8444-000000000007",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "A radical cultural relativist claims: 'Because all aesthetic standards are socially constructed by prevailing ruling classes, a graffiti tag on a subway wall has identical aesthetic worth to Michelangelo's Sistine Chapel ceiling.' What is the primary logical flaw in this argument?",
    "question_type": "multiple_choice",
    "options": [
      "It assumes that subway graffiti was invented in the fifteenth century.",
      "It fallaciously assumes that because an evaluative standard is socially formed and culturally contingent, it cannot possess meaningful gradations of technical complexity, expressiveness, or depth within its cultural context.",
      "It ignores the fact that Michelangelo used scaffolding to paint the ceiling.",
      "It misidentifies the Sistine Chapel as a municipal railway terminal."
    ],
    "correct_answer": "It fallaciously assumes that because an evaluative standard is socially formed and culturally contingent, it cannot possess meaningful gradations of technical complexity, expressiveness, or depth within its cultural context.",
    "explanation": "Recognizing that standards are socially constructed does not imply all creations are equally accomplished; within any coherent aesthetic framework, works differ in mastery and expressive depth.",
    "points": 1,
    "order_index": 6
  },
  {
    "id": "44444444-4444-4444-8444-000000000008",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following scenarios best demonstrates an 'appeal to popularity' (argumentum ad populum) in literary evaluation?",
    "question_type": "multiple_choice",
    "options": [
      "Arguing that a best-selling thriller novel is superior literature to a complex modernist novella simply because it sold ten million copies.",
      "Analyzing the psychological development of a protagonist across a trilogy.",
      "Comparing the metaphorical structures of two renaissance sonnets.",
      "Examining the historical archival drafts of an author's diary."
    ],
    "correct_answer": "Arguing that a best-selling thriller novel is superior literature to a complex modernist novella simply because it sold ten million copies.",
    "explanation": "Equating commercial sales volume or widespread popularity with artistic excellence is a textbook appeal to popularity fallacy.",
    "points": 1,
    "order_index": 7
  },
  {
    "id": "44444444-4444-4444-8444-000000000009",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'The debate over the Western Canon pits traditionalists like Harold Bloom, who defend an aesthetic hierarchy rooted in sublime cognitive originality, against critical theorists who view the canon as a socio-political instrument of patriarchal and imperial hegemony.'\n\nWhat is the central feminist critique of the traditional literary canon?",
    "question_type": "multiple_choice",
    "options": [
      "Feminist critics object to the physical thickness of hardbound canonical anthologies.",
      "The canon historically excluded women writers not due to intrinsic aesthetic deficiency, but through systemic denials of educational access, institutional publishing gatekeeping, and gendered criteria of artistic value.",
      "Women writers refuse to write in poetic verse forms.",
      "Female characters are absent from all nineteenth-century European novels."
    ],
    "correct_answer": "The canon historically excluded women writers not due to intrinsic aesthetic deficiency, but through systemic denials of educational access, institutional publishing gatekeeping, and gendered criteria of artistic value.",
    "explanation": "Feminist criticism (e.g. Virginia Woolf's 'A Room of One's Own') exposes how institutional patriarchal barriers and male-dominated evaluation criteria historically marginalized female voices.",
    "points": 1,
    "order_index": 8
  },
  {
    "id": "44444444-4444-4444-8444-000000000010",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Harold Bloom argued in The Western Canon that canon formation is driven by 'aesthetic aesthetic anxiety and cognitive strength,' rather than political ideology. What is an unstated assumption in Bloom's defense?",
    "question_type": "multiple_choice",
    "options": [
      "Aesthetic criteria can be insulated from and judged independently of the social, material, and political conditions under which literature is produced and patronized.",
      "All canonical writers were employed as university professors.",
      "Non-Western writers never experienced creative anxiety.",
      "Books written in the English language are universally superior to translated works."
    ],
    "correct_answer": "Aesthetic criteria can be insulated from and judged independently of the social, material, and political conditions under which literature is produced and patronized.",
    "explanation": "Bloom assumes an autonomous aesthetic sphere where literary quality transcends material class, race, and gender dynamics.",
    "points": 1,
    "order_index": 9
  },
  {
    "id": "44444444-4444-4444-8444-000000000011",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following propositions represents an inductive argument regarding literary reception?",
    "question_type": "multiple_choice",
    "options": [
      "Because Shakespeare's plays have resonated with audiences across four centuries of diverse global cultures, they will likely continue to speak to future human generations.",
      "If all great literature addresses the human condition, and Hamlet addresses the human condition, then Hamlet must be great literature.",
      "No novel written in prose can be classified as a rhyming lyric poem.",
      "Every book that contains a table of contents is an academic textbook."
    ],
    "correct_answer": "Because Shakespeare's plays have resonated with audiences across four centuries of diverse global cultures, they will likely continue to speak to future human generations.",
    "explanation": "This is an inductive projection based on observed historical patterns across four centuries, inferring probable future relevance rather than a deductive certainty.",
    "points": 1,
    "order_index": 10
  },
  {
    "id": "44444444-4444-4444-8444-000000000012",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "What is meant by the concept of 'canonicity' when applied to university literature curricula?",
    "question_type": "multiple_choice",
    "options": [
      "The legal requirement to read manuscripts using magnifying glasses.",
      "The institutionalized selection of privileged texts deemed essential for cultural literacy and worthy of formal pedagogical transmission.",
      "The process of printing books exclusively on parchment paper.",
      "The mandatory inclusion of military history texts in language departments."
    ],
    "correct_answer": "The institutionalized selection of privileged texts deemed essential for cultural literacy and worthy of formal pedagogical transmission.",
    "explanation": "The canon is the curated corpus of authoritative texts that institutions select as embodying the highest artistic excellence and cultural knowledge.",
    "points": 1,
    "order_index": 11
  },
  {
    "id": "44444444-4444-4444-8444-000000000013",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'In the landmark obscenity trial R v Penguin Books Ltd (1960), the prosecution famously asked the jury whether D.H. Lawrence's Lady Chatterley's Lover was a book they \"would even wish your wife or your servants to read.\" The jury's acquittal established that serious literary merit constitutes a complete statutory defense under the Obscene Publications Act 1959.'\n\nWhat was the profound social and legal transformation signaled by the Lady Chatterley verdict?",
    "question_type": "multiple_choice",
    "options": [
      "It abolished all criminal courts throughout the United Kingdom.",
      "It established that artistic integrity and serious literary inquiry take precedence over traditional Victorian moral prudery and class-based paternalistic censorship.",
      "It made reading D.H. Lawrence compulsory for university entrance examinations.",
      "It transferred publishing licensing authority to trade union councils."
    ],
    "correct_answer": "It established that artistic integrity and serious literary inquiry take precedence over traditional Victorian moral prudery and class-based paternalistic censorship.",
    "explanation": "The trial dismantled paternalistic moral censorship in British law, establishing that literary merit for the public good protects controversial art from obscenity convictions.",
    "points": 1,
    "order_index": 12
  },
  {
    "id": "44444444-4444-4444-8444-000000000014",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Under the classical common-law Hicklin test (1868), what was the definition of legal obscenity?",
    "question_type": "multiple_choice",
    "options": [
      "Whether the price of the book exceeded the daily wage of an agricultural laborer.",
      "Whether the tendency of the matter charged as obscenity is to deprave and corrupt those whose minds are open to such immoral influences.",
      "Whether the text contained spelling mistakes in Latin quotations.",
      "Whether the author had been expelled from a religious congregation."
    ],
    "correct_answer": "Whether the tendency of the matter charged as obscenity is to deprave and corrupt those whose minds are open to such immoral influences.",
    "explanation": "The Hicklin test defined obscenity by its supposed tendency to deprave and corrupt the most vulnerable minds, ignoring artistic intent or serious literary value.",
    "points": 1,
    "order_index": 13
  },
  {
    "id": "44444444-4444-4444-8444-000000000015",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following arguments against censoring transgressive literature is rooted in John Stuart Mill's epistemology in On Liberty?",
    "question_type": "multiple_choice",
    "options": [
      "Censoring offensive ideas deprives society of the opportunity to sharpen and defend the truth against robust challenge, or to discover valuable truths buried within unconventional speech.",
      "Book printing generates substantial local sales tax revenues for municipal authorities.",
      "Writers who are imprisoned become famous celebrities.",
      "Paper production stimulates domestic forestry industries."
    ],
    "correct_answer": "Censoring offensive ideas deprives society of the opportunity to sharpen and defend the truth against robust challenge, or to discover valuable truths buried within unconventional speech.",
    "explanation": "Mill argued that silencing any opinion robs the human race: if the opinion is right, we lose truth; if wrong, we lose the vital perception of truth produced by its collision with error.",
    "points": 1,
    "order_index": 14
  },
  {
    "id": "44444444-4444-4444-8444-000000000016",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following propositions represents an unstated assumption in the claim: 'Banning violent imagery in literature will eliminate real-world violent crime'?",
    "question_type": "multiple_choice",
    "options": [
      "Reading violent fiction directly causes individuals to commit violent crimes, and literary exposure is the sole or dominant causal driver of criminal behavior.",
      "Prisons provide literary education programs to inmates.",
      "Violent crime rates fluctuate during macroeconomic recessions.",
      "All violent novels are printed in hardback editions."
    ],
    "correct_answer": "Reading violent fiction directly causes individuals to commit violent crimes, and literary exposure is the sole or dominant causal driver of criminal behavior.",
    "explanation": "The claim assumes a direct, unmediated causal link between consuming fictional depictions of violence and committing physical acts, ignoring complex socioeconomic, biological, and psychological factors.",
    "points": 1,
    "order_index": 15
  },
  {
    "id": "44444444-4444-4444-8444-000000000017",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'The Italian proverb \"Traduttore, traditore\" (translator, traitor) encapsulates the impossibility of absolute semantic equivalence across cultural and linguistic divides. Walter Benjamin argued that a translation does not strive to be an identical copy, but rather to touch the original fleetingly at an infinitely small point of the sense.'\n\nWhat is the primary linguistic challenge when translating poetic metaphors into another language?",
    "question_type": "multiple_choice",
    "options": [
      "Translators are unable to purchase bilingual dictionaries.",
      "Metaphors carry cultural connotations, etymological histories, phonetic rhythms, and double meanings that cannot be transposed without substantial interpretive alteration.",
      "Foreign alphabets have fewer letters than the Latin script.",
      "Printers cannot reproduce accents on capital letters."
    ],
    "correct_answer": "Metaphors carry cultural connotations, etymological histories, phonetic rhythms, and double meanings that cannot be transposed without substantial interpretive alteration.",
    "explanation": "Poetic language derives its resonance from specific linguistic and cultural associations, sonic textures, and polysemy that resist word-for-word substitution.",
    "points": 1,
    "order_index": 16
  },
  {
    "id": "44444444-4444-4444-8444-000000000018",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Lawrence Venuti distinguishes between 'domestication' and 'foreignization' in translation strategy. What is meant by 'foreignizing' a translation?",
    "question_type": "multiple_choice",
    "options": [
      "Printing the entire text in a foreign currency.",
      "Deliberately retaining stylistic and cultural markers of the source language to disrupt the reader's ethnocentric complacency and signal the foreign origin of the text.",
      "Translating only books written by foreign diplomats.",
      "Refusing to distribute the book within domestic bookstores."
    ],
    "correct_answer": "Deliberately retaining stylistic and cultural markers of the source language to disrupt the reader's ethnocentric complacency and signal the foreign origin of the text.",
    "explanation": "Foreignization preserves source-culture idioms and syntactic strangeness to challenge linguistic imperialism, in contrast to domestication which smooths everything into familiar domestic norms.",
    "points": 1,
    "order_index": 17
  },
  {
    "id": "44444444-4444-4444-8444-000000000019",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following statements represents a logical deduction rather than an empirical hypothesis?",
    "question_type": "multiple_choice",
    "options": [
      "If a poem's identity consists strictly in the exact acoustic and rhythmic properties of the original language, and translating a poem changes those properties, then a poem cannot be translated without altering its identity.",
      "Most readers prefer reading translations that flow seamlessly without awkward archaic phrasing.",
      "Japanese haiku poetry developed during the Edo period in samurai culture.",
      "Translators earn lower royalty percentages than original prose authors."
    ],
    "correct_answer": "If a poem's identity consists strictly in the exact acoustic and rhythmic properties of the original language, and translating a poem changes those properties, then a poem cannot be translated without altering its identity.",
    "explanation": "This follows rigorous deductive logic: premise A + premise B necessarily entail conclusion C regardless of real-world reader preferences.",
    "points": 1,
    "order_index": 18
  },
  {
    "id": "44444444-4444-4444-8444-000000000020",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "What is an underlying flaw in the reasoning: 'Because translation inevitably loses some nuance of the original work, reading translated literature is entirely worthless'?",
    "question_type": "multiple_choice",
    "options": [
      "It commits the 'all-or-nothing' fallacy, ignoring that substantial narrative, philosophical, and emotional richness can be communicated across languages even if total perfection is impossible.",
      "It uses the word 'nuance' inappropriately.",
      "It assumes that all translators live in metropolitan capital cities.",
      "It forgets that dictionaries are compiled by linguistic scholars."
    ],
    "correct_answer": "It commits the 'all-or-nothing' fallacy, ignoring that substantial narrative, philosophical, and emotional richness can be communicated across languages even if total perfection is impossible.",
    "explanation": "This false dilemma treats imperfect translation as equivalent to complete worthlessness, disregarding the enormous value of cross-cultural literary exchange.",
    "points": 1,
    "order_index": 19
  },
  {
    "id": "44444444-4444-4444-8444-000000000021",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'Philosopher Martha Nussbaum contends that reading complex literary fiction cultivates the \"narrative imagination,\" fostering the capacity to perceive the world from the situated perspective of another human being, which is essential for compassionate democratic citizenship.'\n\nAccording to Nussbaum, why is literary narrative uniquely suited to cultivating moral empathy?",
    "question_type": "multiple_choice",
    "options": [
      "Because novels are cheaper to purchase than philosophical treatises.",
      "Because narrative immerses readers in the specific lived experiences, inner vulnerabilities, and moral dilemmas of characters vastly different from themselves, breaking parochial solipsism.",
      "Because reading literature improves typing speed in office workers.",
      "Because fictional characters are bound by international human rights treaties."
    ],
    "correct_answer": "Because narrative immerses readers in the specific lived experiences, inner vulnerabilities, and moral dilemmas of characters vastly different from themselves, breaking parochial solipsism.",
    "explanation": "Nussbaum argues that literary fiction engages our emotions and moral imagination by revealing the rich internal lives of others, cultivating empathy vital for justice.",
    "points": 1,
    "order_index": 20
  },
  {
    "id": "44444444-4444-4444-8444-000000000022",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following findings, if true, would provide the strongest empirical challenge to Nussbaum's thesis regarding literature and moral empathy?",
    "question_type": "multiple_choice",
    "options": [
      "Psychological studies demonstrating that voracious readers of high literature exhibit no higher rates of altruistic prosocial behavior in real-world crises than non-readers.",
      "Surveys indicating that university literature majors buy second-hand paperbacks.",
      "Reports showing that poetry books sell fewer copies than cookbooks.",
      "Historical records showing that William Shakespeare owned real estate in Stratford."
    ],
    "correct_answer": "Psychological studies demonstrating that voracious readers of high literature exhibit no higher rates of altruistic prosocial behavior in real-world crises than non-readers.",
    "explanation": "If cultivating 'narrative imagination' on the page fails to translate into actual moral behavior in real life, Nussbaum's core empirical claim of moral transformation is critically undermined.",
    "points": 1,
    "order_index": 21
  },
  {
    "id": "44444444-4444-4444-8444-000000000023",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "George Orwell asserted in 'Politics and the English Language' that decadent language corrupts thought, and political chaos is connected to the decay of linguistic precision. What is the central mechanism of this connection?",
    "question_type": "multiple_choice",
    "options": [
      "Typewriters break down when typing long words.",
      "Vague euphemisms and inflated phrases are deliberately used to make lies sound truthful and murder respectable, numbing moral consciousness through linguistic obscurity.",
      "Grammar teachers are underpaid in public schools.",
      "Political parties require all members to speak with southern regional accents."
    ],
    "correct_answer": "Vague euphemisms and inflated phrases are deliberately used to make lies sound truthful and murder respectable, numbing moral consciousness through linguistic obscurity.",
    "explanation": "Orwell exposed how political euphemisms (e.g. 'pacification', 'elimination') mask brutal realities, insulating the speaker and listener from the emotional weight of their deeds.",
    "points": 1,
    "order_index": 22
  },
  {
    "id": "44444444-4444-4444-8444-000000000024",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following statements represents an analogy commonly employed in the philosophy of narrative ethics?",
    "question_type": "multiple_choice",
    "options": [
      "A novel is a moral mirror held up to human nature, reflecting our unvarnished ethical complexities.",
      "A book is a collection of paper fibers bound with synthetic glue.",
      "A sentence is a sequence of grammatical clauses separated by punctuation.",
      "A library is a public building funded by municipal council tax."
    ],
    "correct_answer": "A novel is a moral mirror held up to human nature, reflecting our unvarnished ethical complexities.",
    "explanation": "The 'moral mirror' is a classic literary metaphor comparing fiction to a reflective surface that reveals the truth of the observer's inner ethical nature.",
    "points": 1,
    "order_index": 23
  },
  {
    "id": "44444444-4444-4444-8444-000000000025",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'The debate over \"cultural appropriation\" in the arts questions whether artists from historically dominant groups have the right to depict or incorporate the sacred traditions, voices, and traumatic experiences of historically oppressed minority cultures.'\n\nWhat is the defining distinction between cultural exploitation ('appropriation') and respectful cultural exchange ('syncretism') in postcolonial critique?",
    "question_type": "multiple_choice",
    "options": [
      "Whether the artist has registered a trademark with the state patent office.",
      "Whether the cultural borrowing occurs within asymmetric relations of structural power that commodify and profit from marginal traditions while erasing or silencing the originating community.",
      "Whether the artwork was created using oil paint or acrylic watercolors.",
      "Whether the artist has traveled by air to the originating country."
    ],
    "correct_answer": "Whether the cultural borrowing occurs within asymmetric relations of structural power that commodify and profit from marginal traditions while erasing or silencing the originating community.",
    "explanation": "Appropriation is distinguished from mutual syncretism by power asymmetries: dominant actors extract cultural elements for profit and status while the source community remains marginalized.",
    "points": 1,
    "order_index": 24
  },
  {
    "id": "44444444-4444-4444-8444-000000000026",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "An author defending complete creative freedom asserts: 'If novelists are restricted to writing only about characters of their own identical ethnicity, gender, and social background, the very art of the novel—which is the leap of imagination into the unknown—is extinguished.' What is the author's primary logical defense?",
    "question_type": "multiple_choice",
    "options": [
      "That fiction is by definition an act of imagining otherness, and imposing strict autobiographical restrictions reduces literature to solipsistic memoir.",
      "That publishing companies pay higher royalties for autobiographical memoirs.",
      "That readers never enjoy historical fiction.",
      "That all novelists hold advanced degrees in anthropology."
    ],
    "correct_answer": "That fiction is by definition an act of imagining otherness, and imposing strict autobiographical restrictions reduces literature to solipsistic memoir.",
    "explanation": "The core defense of imaginative autonomy is that fiction requires empathic extrapolation beyond the author's biographical boundaries; banning this destroys the novelistic form.",
    "points": 1,
    "order_index": 25
  },
  {
    "id": "44444444-4444-4444-8444-000000000027",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following propositions represents an unstated assumption in the argument: 'Non-indigenous authors who write novels featuring indigenous protagonists should be condemned'?",
    "question_type": "multiple_choice",
    "options": [
      "It is impossible for an outsider to portray the experience of an indigenous person with sufficient authenticity, respect, or legitimate cultural authority.",
      "Indigenous folklore was never written down prior to European contact.",
      "Publishers print books using offset lithographic presses.",
      "Novels written by non-indigenous authors are always bestsellers."
    ],
    "correct_answer": "It is impossible for an outsider to portray the experience of an indigenous person with sufficient authenticity, respect, or legitimate cultural authority.",
    "explanation": "The condemnation presupposes that cultural boundaries create an insurmountable epistemic barrier, making authentic or ethical portrayal by an outsider impossible.",
    "points": 1,
    "order_index": 26
  },
  {
    "id": "44444444-4444-4444-8444-000000000028",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following historical examples represents creative cross-cultural syncretism that fundamentally enriched a musical genre?",
    "question_type": "multiple_choice",
    "options": [
      "The birth of American Jazz and Blues through the synthesis of African rhythmic traditions, work songs, and European harmonic structures.",
      "A corporate pop artist lip-syncing over pre-recorded tracks at a stadium concert.",
      "A vinyl record manufacturer switching from heavy vinyl to lightweight plastic.",
      "A concert hall charging premium prices for front-row balcony seating."
    ],
    "correct_answer": "The birth of American Jazz and Blues through the synthesis of African rhythmic traditions, work songs, and European harmonic structures.",
    "explanation": "Jazz and blues are pre-eminent examples of fertile cultural syncretism, creating entirely new transformative art forms through cross-cultural musical dialogue.",
    "points": 1,
    "order_index": 27
  },
  {
    "id": "44444444-4444-4444-8444-000000000029",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'Generative diffusion models and neural networks can produce mesmerizing visual paintings and sonnets upon receiving textual prompts. Yet aesthetic philosophers debate whether an entity lacking consciousness, lived embodiment, and mortality can genuinely create \"art\".'\n\nWhat is the primary philosophical objection to classifying purely AI-generated outputs as genuine 'art'?",
    "question_type": "multiple_choice",
    "options": [
      "Computers consume too much electrical power during rendering.",
      "Art is an intrinsically communicative human act rooted in subjective conscious intentionality, emotional vulnerability, and existential human experience, none of which an algorithm possesses.",
      "Generative models can only render images in standard RGB color spaces.",
      "Computer algorithms cannot execute mathematical matrix multiplication."
    ],
    "correct_answer": "Art is an intrinsically communicative human act rooted in subjective conscious intentionality, emotional vulnerability, and existential human experience, none of which an algorithm possesses.",
    "explanation": "Philosophers like Arthur Danto argue that art is intentional communication between conscious minds; without conscious intentionality, AI outputs are merely aesthetic artifacts or simulations.",
    "points": 1,
    "order_index": 28
  },
  {
    "id": "44444444-4444-4444-8444-000000000030",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "In the United States copyright case Thaler v. Perlmutter (2023), what did the federal court rule regarding copyright ownership of AI-generated visual art?",
    "question_type": "multiple_choice",
    "options": [
      "The computer software itself is granted legal personhood and holds the copyright.",
      "Copyright law strictly requires human authorship; works created autonomously by artificial intelligence without human creative control cannot be copyrighted.",
      "The electric power company supplying electricity to the computer owns the copyright.",
      "All AI-generated images are automatically classified as state-owned secrets."
    ],
    "correct_answer": "Copyright law strictly requires human authorship; works created autonomously by artificial intelligence without human creative control cannot be copyrighted.",
    "explanation": "The court held that human authorship is a foundational requirement of copyright law; works generated entirely autonomously by machines are ineligible for copyright.",
    "points": 1,
    "order_index": 29
  },
  {
    "id": "44444444-4444-4444-8444-000000000031",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "An art critic argues: 'When photography was invented in the nineteenth century, painters declared that art was dead because a mechanical box could capture reality instantly. Today, critics make the exact same reactionary mistake regarding generative AI.' What is the critic's argument by analogy?",
    "question_type": "multiple_choice",
    "options": [
      "That just as photography transformed and expanded art rather than destroying it, AI will become another expressive medium utilized by human creative practitioners.",
      "That cameras and graphics cards are made from the same metal components.",
      "That nineteenth-century painters were inferior to modern digital artists.",
      "That photographic film is cheaper than digital cloud storage."
    ],
    "correct_answer": "That just as photography transformed and expanded art rather than destroying it, AI will become another expressive medium utilized by human creative practitioners.",
    "explanation": "The analogy argues that historical panic over mechanical technology replacing human artistry proved misplaced with photography, and AI will similarly become a tool of expanded creativity.",
    "points": 1,
    "order_index": 30
  },
  {
    "id": "44444444-4444-4444-8444-000000000032",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following propositions represents a false dilemma regarding artificial intelligence in artistic creation?",
    "question_type": "multiple_choice",
    "options": [
      "Either we immediately outlaw all algorithmic generative models, or human artists will be completely eradicated from society forever.",
      "Copyright statutes must evolve to address the unauthorized scraping of creative works for training data.",
      "Artists can use generative tools to brainstorm preliminary visual concepts.",
      "Digital tools require substantial computational energy during training phases."
    ],
    "correct_answer": "Either we immediately outlaw all algorithmic generative models, or human artists will be completely eradicated from society forever.",
    "explanation": "This creates an absurd false binary between a total ban and total human extinction, ignoring the vast realistic spectrum of hybrid collaboration, regulation, and artistic adaptation.",
    "points": 1,
    "order_index": 31
  },
  {
    "id": "44444444-4444-4444-8444-000000000033",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'Russian Formalism and Anglo-American New Criticism insisted on \"close reading\" of the text as an autonomous verbal icon, isolating it from historical, biographical, and economic context. In contrast, Marxist and New Historicist critics contend that no literary text can be understood outside the material forces and power relations that produced it.'\n\nWhat is the defining technique of Russian Formalist criticism?",
    "question_type": "multiple_choice",
    "options": [
      "Counting the total number of words in a chapter.",
      "Analyzing how literary techniques \"defamiliarize\" ordinary language and perception (ostranenie), making the familiar appear strange to revitalize sensory awareness.",
      "Writing literature exclusively during Siberian winters.",
      "Translating novels into musical notation."
    ],
    "correct_answer": "Analyzing how literary techniques \"defamiliarize\" ordinary language and perception (ostranenie), making the familiar appear strange to revitalize sensory awareness.",
    "explanation": "Viktor Shklovsky coined 'defamiliarization' (ostranenie): the purpose of art is to impart the sensation of things as they are perceived and not as they are known, breaking habitual numbness.",
    "points": 1,
    "order_index": 32
  },
  {
    "id": "44444444-4444-4444-8444-000000000034",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "A New Historicist critic analyzes Shakespeare's The Tempest not primarily as a poetic meditation on art and forgiveness, but as a cultural document reflecting early modern English colonial anxieties regarding the colonization of the Americas. What is this critical approach emphasizing?",
    "question_type": "multiple_choice",
    "options": [
      "The acoustic meter of blank verse syllables.",
      "The historical contextualization of the text as an active participant in the ideological discourses and power struggles of its historical epoch.",
      "The physical durability of seventeenth-century paper printing presses.",
      "The personal dental hygiene of Renaissance theatre actors."
    ],
    "correct_answer": "The historical contextualization of the text as an active participant in the ideological discourses and power struggles of its historical epoch.",
    "explanation": "New Historicism examines literature as deeply embedded in the political discourses, colonial power structures, and cultural anxieties of its specific historical moment.",
    "points": 1,
    "order_index": 33
  },
  {
    "id": "44444444-4444-4444-8444-000000000035",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following, if true, would most weaken the formalist claim that a literary text is entirely self-contained and autonomous?",
    "question_type": "multiple_choice",
    "options": [
      "Readers who lack knowledge of Renaissance political terminology and biblical allusions completely miss the central thematic arguments in Milton's Paradise Lost.",
      "Poets often revise their manuscripts before sending them to publishers.",
      "Literature textbooks are widely sold in university campus stores.",
      "Many classical Greek poems were performed with musical accompaniment."
    ],
    "correct_answer": "Readers who lack knowledge of Renaissance political terminology and biblical allusions completely miss the central thematic arguments in Milton's Paradise Lost.",
    "explanation": "If comprehension requires external historical, theological, and linguistic context, the text cannot be an autonomous verbal island readable in complete isolation.",
    "points": 1,
    "order_index": 34
  },
  {
    "id": "44444444-4444-4444-8444-000000000036",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following statements represents a normative methodological recommendation rather than an empirical description of a literary movement?",
    "question_type": "multiple_choice",
    "options": [
      "New Criticism gained institutional dominance in American university English departments during the 1940s and 1950s.",
      "Critics ought to evaluate literature solely through close textual scrutiny rather than dwelling on the author's private correspondence.",
      "Structuralist critics examined underlying linguistic codes and narrative syntagms.",
      "The Cambridge School of literary criticism was associated with I.A. Richards and F.R. Leavis."
    ],
    "correct_answer": "Critics ought to evaluate literature solely through close textual scrutiny rather than dwelling on the author's private correspondence.",
    "explanation": "The claim that critics 'ought to evaluate' in a particular manner is a prescriptive normative judgment, unlike the factual historical accounts in the other choices.",
    "points": 1,
    "order_index": 35
  },
  {
    "id": "44444444-4444-4444-8444-000000000037",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'Governments routinely face difficult choices when funding the arts through public bodies like Arts Council England. Utilitarians demand justification via economic impact metrics (tourism revenue, urban regeneration), whereas humanists defend public subsidy for intrinsic aesthetic enrichment.'\n\nWhat is the primary danger of justifying state arts funding solely on 'instrumental' economic grounds (e.g., boosting tourism)?",
    "question_type": "multiple_choice",
    "options": [
      "Tourists often misplace their museum entry tickets.",
      "Challenging, avant-garde, or politically transgressive art that does not generate commercial tourist revenue is systematically starved of support in favor of safe, commercial spectacles.",
      "Museum buildings consume more electricity than sports arenas.",
      "Curators will be forced to study accounting rather than art history."
    ],
    "correct_answer": "Challenging, avant-garde, or politically transgressive art that does not generate commercial tourist revenue is systematically starved of support in favor of safe, commercial spectacles.",
    "explanation": "When art is valued solely as an economic engine, funding gravitates toward lucrative blockbuster crowd-pleasers, while risky, experimental, and challenging works are abandoned.",
    "points": 1,
    "order_index": 36
  },
  {
    "id": "44444444-4444-4444-8444-000000000038",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "A libertarian economist argues: 'If an artwork is truly valuable, citizens will voluntarily pay to see it in a free market. Subsidizing unpopular operas and experimental galleries forces working-class taxpayers to fund the elite hobbies of the wealthy.' What is the strongest egalitarian counter-argument?",
    "question_type": "multiple_choice",
    "options": [
      "Opera tickets are printed on glossy paper.",
      "Unregulated market mechanisms fail to account for positive cultural externalities and systematically favor corporate mass entertainment, while public subsidies keep high culture accessible and affordable to all social classes.",
      "Opera singers practice vocal scales for several hours every morning.",
      "Tax revenues are collected through electronic bank transfers."
    ],
    "correct_answer": "Unregulated market mechanisms fail to account for positive cultural externalities and systematically favor corporate mass entertainment, while public subsidies keep high culture accessible and affordable to all social classes.",
    "explanation": "Public arts funding corrects market failure: without subsidies, high art becomes an exclusive playground for the rich, whereas subsidies democratize access for lower-income citizens.",
    "points": 1,
    "order_index": 37
  },
  {
    "id": "44444444-4444-4444-8444-000000000039",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Which of the following propositions represents an unstated assumption in the claim: 'Because public funding should reflect the tastes of the majority, arts grants should be decided by public opinion polls'?",
    "question_type": "multiple_choice",
    "options": [
      "Aesthetic excellence and cultural value are identical to democratic majority popularity at any given moment in time.",
      "Museums are open to the public on weekends.",
      "Public opinion polls have a margin of error of three percent.",
      "Artists are forbidden from participating in municipal elections."
    ],
    "correct_answer": "Aesthetic excellence and cultural value are identical to democratic majority popularity at any given moment in time.",
    "explanation": "The proposal assumes that cultural merit is a direct function of popular consensus, rejecting the notion that groundbreaking art often challenges or outrages majority tastes initially.",
    "points": 1,
    "order_index": 38
  },
  {
    "id": "44444444-4444-4444-8444-000000000040",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "Passage Excerpt: 'The debate over the Parthenon Sculptures (Elgin Marbles) and the Benin Bronzes brings into sharp conflict the \"universal museum\" doctrine and the postcolonial imperative for cultural repatriation.'\n\nWhat is the primary argument advanced by major institutions (like the British Museum) in defense of the 'Universal Museum' concept?",
    "question_type": "multiple_choice",
    "options": [
      "That museum staff speak English better than foreign curators.",
      "That encyclopedic museums provide a global, cosmopolitan space where artifacts from diverse civilizations can be studied comparatively side-by-side by international visitors.",
      "That stone artifacts deteriorate rapidly if transported across international borders.",
      "That ancient Greek civilization was founded by British explorers."
    ],
    "correct_answer": "That encyclopedic museums provide a global, cosmopolitan space where artifacts from diverse civilizations can be studied comparatively side-by-side by international visitors.",
    "explanation": "Universal museums argue they provide an invaluable cosmopolitan hub for cross-cultural comparison and world heritage appreciation beyond nationalist boundaries.",
    "points": 1,
    "order_index": 39
  },
  {
    "id": "44444444-4444-4444-8444-000000000041",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "On what moral and legal ground do nations seeking restitution (such as Nigeria for the Benin Bronzes) demand the return of their cultural treasures?",
    "question_type": "multiple_choice",
    "options": [
      "The artifacts were acquired through violent imperial conquest, looting, and coercive colonial theft, violating basic principles of justice and depriving the originating society of its living cultural heritage.",
      "The British Museum's display cases are poorly lit.",
      "Modern bronze casting techniques are cheaper than historical methods.",
      "The artifacts weigh less than ten kilograms."
    ],
    "correct_answer": "The artifacts were acquired through violent imperial conquest, looting, and coercive colonial theft, violating basic principles of justice and depriving the originating society of its living cultural heritage.",
    "explanation": "Restitution claims rest on corrective justice: items looted during military expeditions (such as the 1897 British sack of Benin City) were acquired illegitimately and must be returned.",
    "points": 1,
    "order_index": 40
  },
  {
    "id": "44444444-4444-4444-8444-000000000042",
    "test_id": "44444444-4444-4444-8444-444444444444",
    "question_text": "A museum trustee argues: 'If we return the Parthenon Sculptures to Athens, where will it end? Every museum in the Western world will have to be completely emptied of its exhibits.' What logical fallacy does this argument commit?",
    "question_type": "multiple_choice",
    "options": [
      "The slippery slope fallacy (assuming without justification that resolving a clear, specific claim of contested colonial acquisition must inevitably lead to the total dissolution of all museums).",
      "An ad hominem attack against Greek archaeologists.",
      "A straw man argument regarding marble quarrying techniques.",
      "The fallacy of composition regarding museum ticket sales."
    ],
    "correct_answer": "The slippery slope fallacy (assuming without justification that resolving a clear, specific claim of contested colonial acquisition must inevitably lead to the total dissolution of all museums).",
    "explanation": "This is a classic slippery slope fallacy: it asserts that returning a well-documented contested artifact will automatically trigger the extreme and absurd outcome of emptying all museums everywhere.",
    "points": 1,
    "order_index": 41
  },
  {
    "id": "55555555-5555-4555-8555-000000000001",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'Economists widely champion carbon pricing—via carbon taxes or cap-and-trade emissions trading systems (ETS)—as the most market-efficient mechanism to internalize negative externalities. By attaching a clear financial liability to greenhouse gas emissions, market forces incentivize decentralized innovation at the lowest marginal abatement cost.'\n\nWhat is the fundamental theoretical difference between a carbon tax and a cap-and-trade emissions trading system?",
    "question_type": "multiple_choice",
    "options": [
      "A carbon tax sets the price of carbon and lets the market determine the quantity of emissions, whereas cap-and-trade sets the total quantity cap and lets market trading determine the price.",
      "A carbon tax applies only to aviation, whereas cap-and-trade applies exclusively to agricultural farms.",
      "A carbon tax is administered by the United Nations, while cap-and-trade is operated by private banks.",
      "A carbon tax guarantees zero emissions within five years, while cap-and-trade allows unlimited emissions."
    ],
    "correct_answer": "A carbon tax sets the price of carbon and lets the market determine the quantity of emissions, whereas cap-and-trade sets the total quantity cap and lets market trading determine the price.",
    "explanation": "Under Weitzman's 'Prices vs Quantities' theorem: a carbon tax fixes the price certainty while emissions volume fluctuates; cap-and-trade fixes emissions volume certainty while allowance prices fluctuate.",
    "points": 1,
    "order_index": 0
  },
  {
    "id": "55555555-5555-4555-8555-000000000002",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Why do critics argue that carbon pricing alone is insufficient to achieve rapid economy-wide decarbonization?",
    "question_type": "multiple_choice",
    "options": [
      "Because fossil fuels are immune to price elasticity.",
      "Because carbon pricing fails to address systemic market failures such as split-incentives in rental housing, the absence of clean transmission grid infrastructure, and long-term capital risks in breakthrough technologies.",
      "Because corporations always ignore taxation when calculating profits.",
      "Because paper currency cannot account for greenhouse gas molecular weights."
    ],
    "correct_answer": "Because carbon pricing fails to address systemic market failures such as split-incentives in rental housing, the absence of clean transmission grid infrastructure, and long-term capital risks in breakthrough technologies.",
    "explanation": "Pricing carbon alone cannot build high-voltage grids, overcome landlord-tenant split incentives, or finance deep infrastructure transitions that require state industrial planning.",
    "points": 1,
    "order_index": 1
  },
  {
    "id": "55555555-5555-4555-8555-000000000003",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What is meant by the economic concept of 'regressivity' in consumer carbon taxation?",
    "question_type": "multiple_choice",
    "options": [
      "The tax decreases over time as renewable energy expands.",
      "Lower-income households spend a significantly higher percentage of their disposable income on essential energy, heating, and fuel than wealthy households, making flat carbon taxes disproportionately punitive for the poor.",
      "The tax applies only to retired citizens.",
      "The tax is collected by municipal town halls rather than central treasuries."
    ],
    "correct_answer": "Lower-income households spend a significantly higher percentage of their disposable income on essential energy, heating, and fuel than wealthy households, making flat carbon taxes disproportionately punitive for the poor.",
    "explanation": "Because basic energy consumption is relatively inelastic and forms a larger share of poor families' budgets, flat carbon taxes act regressively unless revenues are redistributed via dividends.",
    "points": 1,
    "order_index": 2
  },
  {
    "id": "55555555-5555-4555-8555-000000000004",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following policy mechanisms best offsets the regressive impact of a consumer carbon tax?",
    "question_type": "multiple_choice",
    "options": [
      "A 'Carbon Fee and Dividend' model where 100% of collected carbon tax revenues are returned directly to all citizens as equal per-capita cash rebates.",
      "Exempting luxury yacht fuel from taxation.",
      "Increasing sales taxes on public bus transit tickets.",
      "Subsidizing corporate marketing campaigns for commercial airlines."
    ],
    "correct_answer": "A 'Carbon Fee and Dividend' model where 100% of collected carbon tax revenues are returned directly to all citizens as equal per-capita cash rebates.",
    "explanation": "Because low-income households consume fewer fossil fuels in absolute terms than wealthy households, an equal per-capita rebate leaves the majority of lower-income families with a net financial gain.",
    "points": 1,
    "order_index": 3
  },
  {
    "id": "55555555-5555-4555-8555-000000000005",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'The debate between Nicholas Stern (The Stern Review, 2006) and William Nordhaus on climate economics hinges fundamentally on the social discount rate. Stern utilized a near-zero pure rate of time preference (0.1%), arguing that discounting the welfare of future generations simply because they do not yet exist is ethically indefensible.'\n\nWhy does choosing a near-zero discount rate lead to dramatically higher estimates of the 'social cost of carbon'?",
    "question_type": "multiple_choice",
    "options": [
      "It assumes that interest rates on bank loans will become negative.",
      "It prevents future catastrophic climate damages occurring 50 to 100 years from now from being mathematically shrunk to near-zero in present-value terms, demanding urgent aggressive investment today.",
      "It requires governments to abolish all financial stock exchanges.",
      "It leads economists to ignore the physical law of conservation of energy."
    ],
    "correct_answer": "It prevents future catastrophic climate damages occurring 50 to 100 years from now from being mathematically shrunk to near-zero in present-value terms, demanding urgent aggressive investment today.",
    "explanation": "Standard compound discounting shrinks distant catastrophic damages to negligible numbers in present value; a near-zero discount rate gives future generations equal moral weight, justifying massive immediate investment.",
    "points": 1,
    "order_index": 4
  },
  {
    "id": "55555555-5555-4555-8555-000000000006",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "William Nordhaus defended a higher market-based discount rate (around 4-5%) by arguing that:",
    "question_type": "multiple_choice",
    "options": [
      "Future generations will have fewer biological children.",
      "Because historical economic growth makes future generations substantially wealthier and technologically more advanced, current poorer generations should not sacrifice excessively for wealthier future descendants.",
      "Global temperatures will automatically decline after the year 2050.",
      "Carbon dioxide molecules dissipate into space within five days."
    ],
    "correct_answer": "Because historical economic growth makes future generations substantially wealthier and technologically more advanced, current poorer generations should not sacrifice excessively for wealthier future descendants.",
    "explanation": "Nordhaus argued that if future generations will be vastly richer due to compounded growth, spending current resources to spare them damage is regressive compared to investing in productive capital.",
    "points": 1,
    "order_index": 5
  },
  {
    "id": "55555555-5555-4555-8555-000000000007",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What fundamental critique is raised against Nordhaus's assumption of perpetual compound economic growth amidst severe climate instability?",
    "question_type": "multiple_choice",
    "options": [
      "Economic textbooks use too many calculus equations.",
      "Severe global warming of 3°C or 4°C may trigger non-linear planetary tipping points that disrupt ecological and agricultural systems, destroying the very conditions required for continued economic growth.",
      "Banks will refuse to print paper fiat currency.",
      "Stock markets operate five days a week rather than seven."
    ],
    "correct_answer": "Severe global warming of 3°C or 4°C may trigger non-linear planetary tipping points that disrupt ecological and agricultural systems, destroying the very conditions required for continued economic growth.",
    "explanation": "Ecological economists point out that assuming compound economic growth while climate destabilizes assumes the economy is detached from the biosphere, ignoring catastrophic tipping points.",
    "points": 1,
    "order_index": 6
  },
  {
    "id": "55555555-5555-4555-8555-000000000008",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following propositions represents an unstated ethical premise in Stern's economic analysis?",
    "question_type": "multiple_choice",
    "options": [
      "The moral worth of a human life and its fundamental right to a livable biosphere does not diminish merely because that life begins in the twenty-second century.",
      "Solar panels are more efficient than coal turbines.",
      "Wind turbines must be manufactured from recycled aluminum.",
      "Gross Domestic Product is measured in pounds sterling."
    ],
    "correct_answer": "The moral worth of a human life and its fundamental right to a livable biosphere does not diminish merely because that life begins in the twenty-second century.",
    "explanation": "Stern's near-zero discount rate rests squarely on an egalitarian moral stance: temporal distance cannot diminish our moral duties to future persons.",
    "points": 1,
    "order_index": 7
  },
  {
    "id": "55555555-5555-4555-8555-000000000009",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'The ideological conflict between \"Green Growth\" and \"Degrowth\" turns on the feasibility of absolute decoupling. Green growth posits that technological innovation and renewable energy can decouple economic expansion from material throughput and carbon emissions. Degrowth advocates argue that absolute decoupling on the required timescale is an empirical myth.'\n\nWhat is the defining distinction between 'relative decoupling' and 'absolute decoupling'?",
    "question_type": "multiple_choice",
    "options": [
      "Relative decoupling occurs when GDP grows faster than emissions grow; absolute decoupling occurs when GDP grows while absolute emissions decline in total volume.",
      "Relative decoupling applies only to island states, while absolute decoupling applies to continental nations.",
      "Relative decoupling occurs in winter, while absolute decoupling occurs in summer.",
      "Relative decoupling measures water use, while absolute decoupling measures noise pollution."
    ],
    "correct_answer": "Relative decoupling occurs when GDP grows faster than emissions grow; absolute decoupling occurs when GDP grows while absolute emissions decline in total volume.",
    "explanation": "Relative decoupling means emissions per unit of GDP decrease (efficiency gains), but total emissions may still rise; absolute decoupling means total aggregate emissions drop while GDP increases.",
    "points": 1,
    "order_index": 8
  },
  {
    "id": "55555555-5555-4555-8555-000000000010",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "According to degrowth theorists (such as Jason Hickel), why is compound GDP growth incompatible with planetary ecological boundaries?",
    "question_type": "multiple_choice",
    "options": [
      "Because workers dislike receiving higher wages.",
      "Because compound economic growth demands exponentially expanding energy and material resource extraction, overwhelming earth's regenerative biocapacity and waste absorption sinks.",
      "Because factory machinery breaks down when operated continuously.",
      "Because global shipping vessels have reached maximum cargo dimensions."
    ],
    "correct_answer": "Because compound economic growth demands exponentially expanding energy and material resource extraction, overwhelming earth's regenerative biocapacity and waste absorption sinks.",
    "explanation": "Degrowth highlights the physics of compound exponential growth: 3% annual growth doubles an economy in 24 years, creating unsustainable material throughput demands on a finite planet.",
    "points": 1,
    "order_index": 9
  },
  {
    "id": "55555555-5555-4555-8555-000000000011",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What is the primary socio-political challenge facing the political adoption of a 'degrowth' agenda in democratic nations?",
    "question_type": "multiple_choice",
    "options": [
      "Degrowth books are too long to read.",
      "Modern welfare states, pension systems, sovereign debt financing, and full employment models are structurally dependent on continuous economic growth; contracting GDP risks severe political instability and voter backlash.",
      "Degrowth requires all citizens to wear identical clothing.",
      "International airports refuse landing rights to planes from degrowth nations."
    ],
    "correct_answer": "Modern welfare states, pension systems, sovereign debt financing, and full employment models are structurally dependent on continuous economic growth; contracting GDP risks severe political instability and voter backlash.",
    "explanation": "Modern capitalist democracies are structurally hooked on growth for debt solvency, employment, and public welfare funding; contracting GDP without radical systemic restructuring triggers recessionary chaos.",
    "points": 1,
    "order_index": 10
  },
  {
    "id": "55555555-5555-4555-8555-000000000012",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following, if true, would provide the strongest empirical evidence in support of 'Green Growth'?",
    "question_type": "multiple_choice",
    "options": [
      "Data demonstrating that several industrialized European economies sustained GDP expansion over two decades while reducing their total consumption-based territorial and imported carbon emissions by over 40%.",
      "Surveys showing that young consumers prefer buying organic food.",
      "Reports that electric vehicles are heavier than diesel trucks.",
      "Evidence that solar panel manufacturers employ sales marketing staff."
    ],
    "correct_answer": "Data demonstrating that several industrialized European economies sustained GDP expansion over two decades while reducing their total consumption-based territorial and imported carbon emissions by over 40%.",
    "explanation": "Verifying absolute consumption-based decoupling (accounting for imported carbon) over sustained periods proves that economic growth and emission reductions can occur simultaneously.",
    "points": 1,
    "order_index": 11
  },
  {
    "id": "55555555-5555-4555-8555-000000000013",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'The United Nations Framework Convention on Climate Change (UNFCCC) codifies the principle of \"Common But Differentiated Responsibilities and Respective Capabilities\" (CBDR-RC). Developing nations argue that historic cumulative emissions from early-industrialized Western powers exhausted the atmospheric carbon budget.'\n\nWhat is the core ethical argument underlying the demand for climate loss-and-damage compensation from Global North nations?",
    "question_type": "multiple_choice",
    "options": [
      "Global North countries have colder climates.",
      "The 'polluter pays' principle and corrective justice dictate that nations historically responsible for accumulating the vast majority of atmospheric greenhouse gases owe restitution to vulnerable nations suffering the worst climatic impacts.",
      "Developing nations have fewer international legal lawyers.",
      "The United Nations Charter forbids northern nations from running budget deficits."
    ],
    "correct_answer": "The 'polluter pays' principle and corrective justice dictate that nations historically responsible for accumulating the vast majority of atmospheric greenhouse gases owe restitution to vulnerable nations suffering the worst climatic impacts.",
    "explanation": "Corrective justice requires that those whose wrongful historical conduct caused the damage (historical cumulative emissions) compensate the innocent victims who bear the disproportionate costs.",
    "points": 1,
    "order_index": 12
  },
  {
    "id": "55555555-5555-4555-8555-000000000014",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "How do negotiators from developed countries commonly challenge the strict historical responsibility framework?",
    "question_type": "multiple_choice",
    "options": [
      "By asserting that industrial emissions before the late twentieth century occurred in 'excusable ignorance' of climate science, and that current rapidly industrializing emerging economies now emit the majority of annual global emissions.",
      "By claiming that coal soot cleans the upper atmosphere.",
      "By arguing that developing countries have more sunlight for solar energy.",
      "By insisting that sea-level rise is beneficial for commercial shipping."
    ],
    "correct_answer": "By asserting that industrial emissions before the late twentieth century occurred in 'excusable ignorance' of climate science, and that current rapidly industrializing emerging economies now emit the majority of annual global emissions.",
    "explanation": "Developed nations argue moral culpability requires knowledge (excusable ignorance prior to 1990) and note that halting climate change requires immediate mitigation by current giant emitters (e.g. China, India).",
    "points": 1,
    "order_index": 13
  },
  {
    "id": "55555555-5555-4555-8555-000000000015",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following demonstrates an ethical dilemma inherent in climate finance transfers?",
    "question_type": "multiple_choice",
    "options": [
      "Whether climate aid should be delivered as loans that exacerbate developing country sovereign debt burdens, or as non-repayable grants that reflect unconditional historical reparations.",
      "Whether weather forecasts should be presented in Celsius or Fahrenheit.",
      "Whether international climate summits should serve vegetarian meals.",
      "Whether delegates should fly in commercial airliners or turboprop planes."
    ],
    "correct_answer": "Whether climate aid should be delivered as loans that exacerbate developing country sovereign debt burdens, or as non-repayable grants that reflect unconditional historical reparations.",
    "explanation": "Offering climate finance as debt trap loans forces climate-impacted developing nations to pay interest on loans to recover from disasters caused by the creditors' emissions.",
    "points": 1,
    "order_index": 14
  },
  {
    "id": "55555555-5555-4555-8555-000000000016",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following statements represents an empirical fact rather than a normative ethical assertion?",
    "question_type": "multiple_choice",
    "options": [
      "Rich countries have an absolute moral obligation to transfer $100 billion annually to the Green Climate Fund.",
      "Between 1751 and 2020, the United States and European nations generated more than fifty percent of cumulative global CO2 emissions.",
      "It is profoundly unfair for island nations to submerge while western executives profit.",
      "Developing countries ought to be exempted from all decarbonization commitments."
    ],
    "correct_answer": "Between 1751 and 2020, the United States and European nations generated more than fifty percent of cumulative global CO2 emissions.",
    "explanation": "This is a measurable historical emission datum, unlike the normative moral claims ('moral obligation', 'profoundly unfair', 'ought to be exempted').",
    "points": 1,
    "order_index": 15
  },
  {
    "id": "55555555-5555-4555-8555-000000000017",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'Nuclear energy presents a classic dilemma within environmental ethics. Proponents highlight its massive energy density, zero direct operational carbon emissions, and vital capacity to provide non-intermittent baseload electricity. Opponents cite the catastrophic tail-risks of meltdowns, nuclear weapons proliferation, and the unresolved ethical burden of managing radioactive waste for millennia.'\n\nHow do environmental advocates who favor nuclear power argue against intermittent renewables (wind and solar)?",
    "question_type": "multiple_choice",
    "options": [
      "Nuclear reactors can be built overnight in municipal parks.",
      "Intermittent renewables require massive overbuilding, colossal land use footprints, mineral-intensive battery storage, and dispatchable fossil backups to guarantee electrical grid stability during windless, sunless periods.",
      "Solar panels reflect sunlight away from the earth.",
      "Wind turbine blades deplete the atmospheric oxygen layer."
    ],
    "correct_answer": "Intermittent renewables require massive overbuilding, colossal land use footprints, mineral-intensive battery storage, and dispatchable fossil backups to guarantee electrical grid stability during windless, sunless periods.",
    "explanation": "Pro-nuclear environmentalists argue that the low power density and intermittency of renewables require vast land, immense mineral inputs for batteries, and backup power that often defaults to gas.",
    "points": 1,
    "order_index": 16
  },
  {
    "id": "55555555-5555-4555-8555-000000000018",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "How is the 'Precautionary Principle' invoked by anti-nuclear environmentalists?",
    "question_type": "multiple_choice",
    "options": [
      "Where an activity poses threats of irreversible harm to human health or the environment (such as long-lived radioactive contamination or reactor meltdowns), lack of absolute scientific certainty regarding risk probabilities should not justify proceeding.",
      "Governments should take precautions to prevent electricity prices from dropping too low.",
      "Nuclear power plants should only be built by private corporations.",
      "Radiation should be measured in ounces rather than sieverts."
    ],
    "correct_answer": "Where an activity poses threats of irreversible harm to human health or the environment (such as long-lived radioactive contamination or reactor meltdowns), lack of absolute scientific certainty regarding risk probabilities should not justify proceeding.",
    "explanation": "The Precautionary Principle states that when potential damages are catastrophic and irreversible, the burden of proof falls on demonstrating safety rather than accepting low-probability catastrophic risks.",
    "points": 1,
    "order_index": 17
  },
  {
    "id": "55555555-5555-4555-8555-000000000019",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What is the primary economic critique of new nuclear power plant construction in liberalized electricity markets?",
    "question_type": "multiple_choice",
    "options": [
      "Uranium atoms are too heavy to transport.",
      "Extremely high upfront capital expenditure, persistent regulatory delays, and multi-year construction cost overruns make nuclear uncompetitive against rapidly plummeting renewable and storage costs.",
      "Nuclear plants produce too much clean electricity for utility companies to sell.",
      "Electric utilities are legally forbidden from issuing corporate bonds."
    ],
    "correct_answer": "Extremely high upfront capital expenditure, persistent regulatory delays, and multi-year construction cost overruns make nuclear uncompetitive against rapidly plummeting renewable and storage costs.",
    "explanation": "The core economic stumbling block for new nuclear is staggering capital costs and decade-long financing delays, while solar and wind costs have plummeted by over 80%.",
    "points": 1,
    "order_index": 18
  },
  {
    "id": "55555555-5555-4555-8555-000000000020",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following propositions represents an unstated assumption in the argument: 'Germany's premature phase-out of nuclear power was an environmental catastrophe'?",
    "question_type": "multiple_choice",
    "options": [
      "Replacing carbon-free nuclear generation with dirtier coal and gas power to cover baseload demands increased total greenhouse emissions and air pollution mortalities compared to keeping reactors online.",
      "Germany has fewer rivers than France.",
      "German engineering universities teach mechanical physics.",
      "Nuclear waste storage casks are made from solid copper."
    ],
    "correct_answer": "Replacing carbon-free nuclear generation with dirtier coal and gas power to cover baseload demands increased total greenhouse emissions and air pollution mortalities compared to keeping reactors online.",
    "explanation": "The claim assumes that the phased-out nuclear capacity was compensated for by fossil fuels (lignite/gas) rather than purely clean alternatives, driving up net emissions.",
    "points": 1,
    "order_index": 19
  },
  {
    "id": "55555555-5555-4555-8555-000000000021",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'The European Union's Carbon Border Adjustment Mechanism (CBAM) imposes an import levy on carbon-intensive goods (such as steel, cement, and aluminum) imported from countries with laxer emissions regulations, equalizing the carbon price paid by domestic and foreign producers.'\n\nWhat is the primary economic objective of introducing a CBAM?",
    "question_type": "multiple_choice",
    "options": [
      "To ban all international shipping containers from docking in European ports.",
      "To prevent 'carbon leakage' (where domestic industries relocate production to unconstrained foreign jurisdictions to evade carbon prices) while encouraging trading partners to adopt carbon pricing.",
      "To increase customs inspection wait times for foreign tourists.",
      "To subsidize domestic European coal extraction mines."
    ],
    "correct_answer": "To prevent 'carbon leakage' (where domestic industries relocate production to unconstrained foreign jurisdictions to evade carbon prices) while encouraging trading partners to adopt carbon pricing.",
    "explanation": "CBAM stops carbon leakage—offshoring emissions to pollute elsewhere—and levels the playing field so domestic decarbonization doesn't destroy local industry.",
    "points": 1,
    "order_index": 20
  },
  {
    "id": "55555555-5555-4555-8555-000000000022",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "On what legal basis do developing export nations (such as India and South Africa) challenge the EU CBAM under World Trade Organization (WTO) rules?",
    "question_type": "multiple_choice",
    "options": [
      "They argue that CBAM acts as a discriminatory protectionist tariff disguised as environmental policy, violating WTO Most-Favoured-Nation and National Treatment rules and undermining the UNFCCC CBDR principle.",
      "They claim that European ports lack container cranes.",
      "They assert that cement cannot be traded across oceans.",
      "They argue that the European Union is not recognized as a legal trading entity."
    ],
    "correct_answer": "They argue that CBAM acts as a discriminatory protectionist tariff disguised as environmental policy, violating WTO Most-Favoured-Nation and National Treatment rules and undermining the UNFCCC CBDR principle.",
    "explanation": "Developing countries argue CBAM violates WTO non-discrimination principles and weaponizes trade to impose European carbon pricing on developing economies that lack equivalent capital.",
    "points": 1,
    "order_index": 21
  },
  {
    "id": "55555555-5555-4555-8555-000000000023",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following conditions is most crucial for a border carbon tariff to survive judicial scrutiny under WTO Article XX (General Exceptions for environmental protection)?",
    "question_type": "multiple_choice",
    "options": [
      "The tax revenues must be spent on European military hardware.",
      "The measure must be applied even-handedly without arbitrary discrimination, must credit carbon costs already paid in the exporting country, and must be designed genuinely for climate protection rather than domestic commercial protectionism.",
      "The tax must apply exclusively to non-English-speaking nations.",
      "The imported products must be re-packaged in cardboard cartons."
    ],
    "correct_answer": "The measure must be applied even-handedly without arbitrary discrimination, must credit carbon costs already paid in the exporting country, and must be designed genuinely for climate protection rather than domestic commercial protectionism.",
    "explanation": "WTO Article XX exceptions require that environmental trade measures do not constitute arbitrary or disguised restrictions on international trade.",
    "points": 1,
    "order_index": 22
  },
  {
    "id": "55555555-5555-4555-8555-000000000024",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following statements represents an inductive generalization regarding carbon border taxes?",
    "question_type": "multiple_choice",
    "options": [
      "Because the EU's announcement of CBAM prompted trading partners like the UK and Turkey to design their own carbon border adjustments, upcoming unilateral border taxes will invariably induce global policy alignment.",
      "If all carbon taxes are levied on embedded emissions, and cement contains embedded emissions, then cement is subject to the levy.",
      "No export tariff can be classified as an unconditional domestic grant.",
      "Either a company pays the import carbon levy, or its goods are barred from clearance."
    ],
    "correct_answer": "Because the EU's announcement of CBAM prompted trading partners like the UK and Turkey to design their own carbon border adjustments, upcoming unilateral border taxes will invariably induce global policy alignment.",
    "explanation": "This projects from observed specific instances (EU inducing UK/Turkey action) into an inductive generalized rule about future unilateral policies.",
    "points": 1,
    "order_index": 23
  },
  {
    "id": "55555555-5555-4555-8555-000000000025",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'In the landmark Urgenda Foundation v State of the Netherlands (2019), the Dutch Supreme Court ruled that the government's failure to enact sufficiently ambitious greenhouse gas reductions violated Articles 2 (right to life) and 8 (right to private and family life) of the European Convention on Human Rights.'\n\nWhat was the revolutionary constitutional precedent established in Urgenda?",
    "question_type": "multiple_choice",
    "options": [
      "The court dissolved the Dutch parliament and called emergency elections.",
      "The court established that national governments possess legally enforceable human rights duties to protect their citizens against the dangerous risks of climate change by adopting adequate emissions reduction targets.",
      "The court declared all fossil fuel companies bankrupt by judicial fiat.",
      "The court ordered the Dutch navy to blockade international oil tankers."
    ],
    "correct_answer": "The court established that national governments possess legally enforceable human rights duties to protect their citizens against the dangerous risks of climate change by adopting adequate emissions reduction targets.",
    "explanation": "Urgenda proved that human rights law can be weaponized in court to force sovereign governments to raise climate mitigation targets to protect citizens' fundamental rights to life.",
    "points": 1,
    "order_index": 24
  },
  {
    "id": "55555555-5555-4555-8555-000000000026",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "In Neubauer v Germany (2021), the German Federal Constitutional Court struck down provisions of the Federal Climate Change Act. What was the core doctrinal innovation introduced in the ruling?",
    "question_type": "multiple_choice",
    "options": [
      "The court ruled that coal-mining regions must receive free beer subsidies.",
      "The doctrine of 'intertemporal freedom': by postponing deep emission cuts to the post-2030 period, the state offloads an intolerable burden of radical liberty restrictions onto younger and future generations.",
      "The court held that Germany must leave the European Union.",
      "The court ruled that children under 18 cannot be subject to environmental laws."
    ],
    "correct_answer": "The doctrine of 'intertemporal freedom': by postponing deep emission cuts to the post-2030 period, the state offloads an intolerable burden of radical liberty restrictions onto younger and future generations.",
    "explanation": "The court created the concept of intertemporal freedom: delaying carbon cuts now consumes future generations' carbon budget, forcing them into draconic future restrictions of basic liberties.",
    "points": 1,
    "order_index": 25
  },
  {
    "id": "55555555-5555-4555-8555-000000000027",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What is meant by the jurisprudential concept of 'Rights of Nature' (Earth Jurisprudence), such as granting legal personhood to the Whanganui River in New Zealand?",
    "question_type": "multiple_choice",
    "options": [
      "Allowing fish to open offshore bank accounts.",
      "Granting legal rights and standing directly to ecosystems and natural features themselves, recognized as legal persons with human guardians to enforce their rights in court, rather than treating nature merely as exploitable human property.",
      "Prohibiting humans from swimming in natural bodies of water.",
      "Renaming all rivers after sitting members of parliament."
    ],
    "correct_answer": "Granting legal rights and standing directly to ecosystems and natural features themselves, recognized as legal persons with human guardians to enforce their rights in court, rather than treating nature merely as exploitable human property.",
    "explanation": "Rights of Nature shifts law from anthropocentric property exploitation to ecocentric legal standing, recognizing rivers or forests as legal entities with enforceable rights.",
    "points": 1,
    "order_index": 26
  },
  {
    "id": "55555555-5555-4555-8555-000000000028",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following arguments best illustrates the 'separation of powers' critique leveled against climate litigation by activist judges?",
    "question_type": "multiple_choice",
    "options": [
      "Judicial robes are uncomfortable during summer trials.",
      "Formulating national energy budgets, carbon targets, and economic trade-offs is inherently a political question belonging to the democratically elected branches of government, not to unelected judges.",
      "Courts do not possess digital temperature thermometers.",
      "Lawyers earn higher fees in commercial arbitration than in constitutional litigation."
    ],
    "correct_answer": "Formulating national energy budgets, carbon targets, and economic trade-offs is inherently a political question belonging to the democratically elected branches of government, not to unelected judges.",
    "explanation": "Critics contend that setting economic emission targets is a polycentric political decision requiring balancing competing social goods, which unelected courts lack democratic legitimacy to mandate.",
    "points": 1,
    "order_index": 27
  },
  {
    "id": "55555555-5555-4555-8555-000000000029",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'In 1865, William Stanley Jevons observed that improvements in steam engine fuel efficiency did not decrease total national coal consumption; instead, they made coal power cheaper and more ubiquitous, causing aggregate coal consumption to skyrocket. This phenomenon is known as the Jevons Paradox or the Rebound Effect.'\n\nHow does the Jevons Paradox undermine technological energy efficiency mandates as a standalone climate strategy?",
    "question_type": "multiple_choice",
    "options": [
      "Engineers refuse to design efficient machinery.",
      "Efficiency gains lower the operating cost of energy services, incentivizing increased usage (direct rebound) and freeing up money that consumers spend on other energy-intensive goods and services (indirect rebound), eroding expected emissions cuts.",
      "Energy efficiency causes industrial factories to overheat.",
      "Modern appliances have shorter warranties than historical machines."
    ],
    "correct_answer": "Efficiency gains lower the operating cost of energy services, incentivizing increased usage (direct rebound) and freeing up money that consumers spend on other energy-intensive goods and services (indirect rebound), eroding expected emissions cuts.",
    "explanation": "When technology makes energy use cheaper, behavior responds to lower prices by using more of the service or spending the savings elsewhere, often canceling out a significant fraction of efficiency gains.",
    "points": 1,
    "order_index": 28
  },
  {
    "id": "55555555-5555-4555-8555-000000000030",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following real-world scenarios best illustrates a 'direct rebound effect'?",
    "question_type": "multiple_choice",
    "options": [
      "A commuter purchases a hybrid vehicle with double the fuel efficiency of their old sedan, and consequently decides to drive significantly longer distances and make more frequent road trips because driving has become so cheap.",
      "A homeowner installs insulation and uses the money saved on heating to purchase a holiday flight to the Caribbean.",
      "A utility builds a solar farm to replace an aging gas turbine.",
      "A municipal council replaces incandescent streetlights with LED bulbs."
    ],
    "correct_answer": "A commuter purchases a hybrid vehicle with double the fuel efficiency of their old sedan, and consequently decides to drive significantly longer distances and make more frequent road trips because driving has become so cheap.",
    "explanation": "Direct rebound occurs within the exact same energy service: driving becomes cheaper per mile, leading the driver to consume more driving miles.",
    "points": 1,
    "order_index": 29
  },
  {
    "id": "55555555-5555-4555-8555-000000000031",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What policy measure is necessary to prevent the Jevons Paradox from neutralizing technical energy efficiency gains?",
    "question_type": "multiple_choice",
    "options": [
      "Prohibiting the sale of efficient household appliances.",
      "Combining technical efficiency standards with rising carbon prices or energy caps that keep the marginal cost of energy services constant or rising, channeling savings away from increased consumption.",
      "Ordering factories to operate only every second day.",
      "Rationing electricity using analog rotary switches."
    ],
    "correct_answer": "Combining technical efficiency standards with rising carbon prices or energy caps that keep the marginal cost of energy services constant or rising, channeling savings away from increased consumption.",
    "explanation": "To prevent rebound, economists recommend pairing efficiency standards with carbon pricing to ensure that energy does not become cheaper, preventing behavioral overconsumption.",
    "points": 1,
    "order_index": 30
  },
  {
    "id": "55555555-5555-4555-8555-000000000032",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following demonstrates a flaw in the reasoning: 'Because LED lighting reduces electricity use per lumen by 80%, global lighting energy demand will inevitably fall by 80%'?",
    "question_type": "multiple_choice",
    "options": [
      "It confuses nominal prices with real inflation rates.",
      "It fallaciously assumes lighting demand is completely inelastic, ignoring that dramatic cost reductions cause widespread adoption of architectural, commercial, and outdoor nighttime illumination where lights previously did not exist.",
      "It ignores the fact that LED bulbs emit blue light wavelengths.",
      "It assumes that light bulbs are manufactured from glass."
    ],
    "correct_answer": "It fallaciously assumes lighting demand is completely inelastic, ignoring that dramatic cost reductions cause widespread adoption of architectural, commercial, and outdoor nighttime illumination where lights previously did not exist.",
    "explanation": "Demand for lighting is elastic; cheaper lumens led to massive expansion of decorative, nighttime, and commercial illumination, offsetting much of the technical efficiency savings.",
    "points": 1,
    "order_index": 31
  },
  {
    "id": "55555555-5555-4555-8555-000000000033",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'Solar Radiation Management (SRM), such as injecting sulfur dioxide aerosols into the stratosphere to mimic volcanic cooling, offers a rapid, low-cost lever to reduce global surface temperatures. However, it creates severe \"moral hazard\" and \"termination shock\" risks.'\n\nWhat is the 'moral hazard' critique of researching and deploying solar geoengineering?",
    "question_type": "multiple_choice",
    "options": [
      "Engineers working on aerosol planes might face aviation insurance premium hikes.",
      "The prospect of an easy, cheap technofix relieves political pressure on fossil fuel corporations and governments to execute the difficult economic work of emissions abatement, locking in ongoing ecological devastation.",
      "Sulfur aerosols will turn the sky a permanent dark green color.",
      "Stratospheric balloons violate municipal zoning bylaws."
    ],
    "correct_answer": "The prospect of an easy, cheap technofix relieves political pressure on fossil fuel corporations and governments to execute the difficult economic work of emissions abatement, locking in ongoing ecological devastation.",
    "explanation": "Moral hazard occurs when insurance against a peril encourages risky behavior: geoengineering offers an apparent technofix that undermines political will to stop burning fossil fuels.",
    "points": 1,
    "order_index": 32
  },
  {
    "id": "55555555-5555-4555-8555-000000000034",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What catastrophic risk is referred to as 'termination shock' in stratospheric aerosol injection scenarios?",
    "question_type": "multiple_choice",
    "options": [
      "The sudden detonation of aerosol dispersal aircraft engines.",
      "If SRM is deployed for decades while atmospheric CO2 continues rising, and the aerosol injection is abruptly halted due to war or technical failure, accumulated warming will strike the planet within years, triggering sudden runaway temperature spikes.",
      "The electrical short-circuiting of global weather radar arrays.",
      "The immediate freezing of the equator."
    ],
    "correct_answer": "If SRM is deployed for decades while atmospheric CO2 continues rising, and the aerosol injection is abruptly halted due to war or technical failure, accumulated warming will strike the planet within years, triggering sudden runaway temperature spikes.",
    "explanation": "Termination shock is the terrifying consequence of masking continuous CO2 buildup: if the reflective mask ever fails, decades of masked warming rebound in a matter of years, causing ecological collapse.",
    "points": 1,
    "order_index": 33
  },
  {
    "id": "55555555-5555-4555-8555-000000000035",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Why does Solar Radiation Management fail to address ocean acidification?",
    "question_type": "multiple_choice",
    "options": [
      "Because sulfuric acid is absorbed exclusively by desert sand dunes.",
      "Because SRM merely reflects sunlight to lower atmospheric temperature; it does not reduce CO2 concentrations in the atmosphere, which continue to dissolve into seawater forming carbonic acid.",
      "Because ocean currents circulate in clockwise directions in the Northern Hemisphere.",
      "Because marine life is immune to pH water variations."
    ],
    "correct_answer": "Because SRM merely reflects sunlight to lower atmospheric temperature; it does not reduce CO2 concentrations in the atmosphere, which continue to dissolve into seawater forming carbonic acid.",
    "explanation": "SRM manages radiative forcing without removing CO2; high atmospheric CO2 continues to acidify the oceans, devastating coral reefs and marine food chains.",
    "points": 1,
    "order_index": 34
  },
  {
    "id": "55555555-5555-4555-8555-000000000036",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following propositions represents an unstated assumption in the argument: 'A rogue state suffering catastrophic drought has a sovereign right to unilaterally deploy stratospheric aerosols'?",
    "question_type": "multiple_choice",
    "options": [
      "The sovereign state's duty to protect its domestic population overrides international customary duties not to cause transboundary atmospheric and precipitation disruptions to other sovereign nations.",
      "Aircraft fuel is cheaper in developing nations.",
      "Drought conditions are caused exclusively by solar sunspots.",
      "Stratospheric winds blow in predictable concentric rings."
    ],
    "correct_answer": "The sovereign state's duty to protect its domestic population overrides international customary duties not to cause transboundary atmospheric and precipitation disruptions to other sovereign nations.",
    "explanation": "Unilateral deployment assumes domestic necessity trumps international legal duties preventing transboundary environmental interference (e.g. altering monsoon patterns in neighboring countries).",
    "points": 1,
    "order_index": 35
  },
  {
    "id": "55555555-5555-4555-8555-000000000037",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'Animal agriculture accounts for nearly sixty percent of agricultural greenhouse emissions and drives eighty percent of global deforestation for cattle grazing and soy feed crops. Yet governments subsidize industrial livestock at rates vastly exceeding support for plant-based nutrition.'\n\nWhat is the primary economic distortion created by state agricultural subsidies for livestock production?",
    "question_type": "multiple_choice",
    "options": [
      "Livestock farmers are unable to purchase tractor diesel fuel.",
      "Subsidies artificially depress the consumer price of meat and dairy products, concealing their massive environmental externalities and disincentivizing consumer transition to low-carbon plant diets.",
      "Supermarkets refuse to sell poultry meat.",
      "Cattle farming produces zero gross domestic product."
    ],
    "correct_answer": "Subsidies artificially depress the consumer price of meat and dairy products, concealing their massive environmental externalities and disincentivizing consumer transition to low-carbon plant diets.",
    "explanation": "Subsidies keep animal products artificially cheap, insulating consumers from the true ecological costs and placing sustainable plant-based alternatives at a market disadvantage.",
    "points": 1,
    "order_index": 36
  },
  {
    "id": "55555555-5555-4555-8555-000000000038",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Which of the following arguments best explains why imposing a 'meat tax' based on carbon intensity faces fierce political resistance compared to energy carbon taxes?",
    "question_type": "multiple_choice",
    "options": [
      "Food consumption is deeply tied to cultural identity, culinary tradition, and bodily autonomy, making dietary taxation feel like an intolerable state intrusion into intimate personal life.",
      "Meat packages cannot display barcode pricing tags.",
      "Livestock consume less water than vegetable crops.",
      "Farmers never participate in rural electoral politics."
    ],
    "correct_answer": "Food consumption is deeply tied to cultural identity, culinary tradition, and bodily autonomy, making dietary taxation feel like an intolerable state intrusion into intimate personal life.",
    "explanation": "Food choices are deeply bound with cultural habits, tradition, and personal identity; taxing food feels visceral and intrusive compared to abstract utility bills.",
    "points": 1,
    "order_index": 37
  },
  {
    "id": "55555555-5555-4555-8555-000000000039",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "What is an underlying flaw in the reasoning: 'Because regenerative cattle grazing sequesters some soil carbon, expanding industrial beef production is environmentally beneficial'?",
    "question_type": "multiple_choice",
    "options": [
      "It generalizes from small-scale rotational grazing to intensive industrial beef production, while ignoring that cattle emit potent enteric methane and require land footprints that drive tropical deforestation.",
      "It presumes cows sleep during the daytime.",
      "It assumes all soil carbon is lost to wind erosion.",
      "It uses the word 'regenerative' in an ungrammatical context."
    ],
    "correct_answer": "It generalizes from small-scale rotational grazing to intensive industrial beef production, while ignoring that cattle emit potent enteric methane and require land footprints that drive tropical deforestation.",
    "explanation": "This is a fallacy of illicit generalization: modest soil carbon gains under idealized holistic grazing cannot compensate for the massive enteric methane and deforestation footprint of global beef demand.",
    "points": 1,
    "order_index": 38
  },
  {
    "id": "55555555-5555-4555-8555-000000000040",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "Passage Excerpt: 'Environmental, Social, and Governance (ESG) ratings have become ubiquitous across global asset management. Yet critics argue that ESG metrics measure how climate risk affects a company's bottom-line profitability, rather than how the company's activities impact the planet.'\n\nWhat is meant by the concept of 'Single Materiality' versus 'Double Materiality' in corporate sustainability reporting?",
    "question_type": "multiple_choice",
    "options": [
      "Single materiality considers only the financial risks to the company from environmental changes; double materiality considers both financial risks to the company AND the outward impacts of the company on the environment and society.",
      "Single materiality applies to public companies; double materiality applies to municipal charities.",
      "Single materiality is measured once a year; double materiality is measured every six months.",
      "Single materiality measures water use; double materiality measures plastic waste."
    ],
    "correct_answer": "Single materiality considers only the financial risks to the company from environmental changes; double materiality considers both financial risks to the company AND the outward impacts of the company on the environment and society.",
    "explanation": "Single materiality evaluates how climate change risks company profits; double materiality (pioneered in the EU CSRD) also evaluates how the company harms the climate and society.",
    "points": 1,
    "order_index": 39
  },
  {
    "id": "55555555-5555-4555-8555-000000000041",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "How does the purchase of unregulated 'phantom carbon offsets' facilitate corporate greenwashing?",
    "question_type": "multiple_choice",
    "options": [
      "Offsets are printed on expensive security paper.",
      "Companies claim 'carbon neutrality' by buying cheap credits for unverified forest preservation projects that would have been protected anyway, or that burn down years later, while continuing business-as-usual fossil emissions.",
      "Carbon offsets are illegal under English common law.",
      "Forest trees refuse to absorb carbon dioxide during nighttime hours."
    ],
    "correct_answer": "Companies claim 'carbon neutrality' by buying cheap credits for unverified forest preservation projects that would have been protected anyway, or that burn down years later, while continuing business-as-usual fossil emissions.",
    "explanation": "Phantom offsets lack additionality and permanence, allowing corporations to market themselves as 'net-zero' while continuing to pour real greenhouse gases into the atmosphere.",
    "points": 1,
    "order_index": 40
  },
  {
    "id": "55555555-5555-4555-8555-000000000042",
    "test_id": "55555555-5555-4555-8555-555555555555",
    "question_text": "In ClientEarth v Shell plc (2023), environmental lawyers sued the board of directors for failing to prepare the oil company for the global net-zero transition. What was the legal duty invoked by the plaintiffs?",
    "question_type": "multiple_choice",
    "options": [
      "The directors' statutory fiduciary duty under Section 172 of the Companies Act 2006 to act in the way they consider, in good faith, would be most likely to promote the long-term success of the company.",
      "The criminal law against corporate manslaughter.",
      "The maritime salvage treaty governing North Sea drilling rigs.",
      "The tort of public nuisance for noise pollution near petrol stations."
    ],
    "correct_answer": "The directors' statutory fiduciary duty under Section 172 of the Companies Act 2006 to act in the way they consider, in good faith, would be most likely to promote the long-term success of the company.",
    "explanation": "ClientEarth argued that failing to manage climate risk breaches the director's fiduciary duty to promote the company's long-term commercial success, pioneering corporate governance climate litigation.",
    "points": 1,
    "order_index": 41
  }
,
  {
  "id": "66666666-6666-4666-8666-000000000001",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'There is no man so unsuited to the task of speaking about memory as I am, for I find scarcely a trace of it in myself, and I do not think there is another man in the world so deficient. People commonly mistake memory for judgment, but experience reveals that men blessed with excellent memories often suffer from remarkably feeble judgment. If my memory had been good, I should have deafened all my friends with my chatter, for the storehouse of memory is generally better stocked than that of invention. Furthermore, my infirmity shields me from ambition, for lack of memory is an intolerable defect in anyone who takes on the burden of the world's affairs.'\n\nIn the opening sentence of the excerpt, which rhetorical device does the author primarily employ?",
  "question_type": "multiple_choice",
  "options": [
    "Dramatic hyperbole designed to cultivate an air of philosophical modesty.",
    "An empirical syllogism supported by psychometric clinical observation.",
    "An uncritical appeal to external philosophical authorities such as Plato.",
    "A deductive proof demonstrating the impossibility of autobiographical writing."
  ],
  "correct_answer": "Dramatic hyperbole designed to cultivate an air of philosophical modesty.",
  "explanation": "Montaigne exaggerates his lack of memory ('scarcely a trace', 'no another man in the world so deficient') to humorously introduce his reflections from a position of modesty.",
  "points": 1,
  "order_index": 0
},
  {
  "id": "66666666-6666-4666-8666-000000000002",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "According to Montaigne's argument, why does having an exceptional memory pose a potential communicative liability?",
  "question_type": "multiple_choice",
  "options": [
    "It causes speakers to confuse imaginative speculation with verifiable factual truth.",
    "It tempts individuals to bore companions by regurgitating an excess of recollected facts rather than engaging in concise, inventive conversation.",
    "It makes individuals intellectually incapable of mastering judicial rhetoric.",
    "It renders them vulnerable to psychological manipulation during cross-examination."
  ],
  "correct_answer": "It tempts individuals to bore companions by regurgitating an excess of recollected facts rather than engaging in concise, inventive conversation.",
  "explanation": "Montaigne observes that without a poor memory he would have 'deafened all my friends with my chatter', since the storehouse of memory supplies endless material compared to spontaneous invention.",
  "points": 1,
  "order_index": 1
},
  {
  "id": "66666666-6666-4666-8666-000000000003",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Which of the following propositions best reflects the fundamental philosophical distinction Montaigne draws between 'memory' and 'judgment'?",
  "question_type": "multiple_choice",
  "options": [
    "Memory is an innate cognitive faculty, whereas judgment is entirely an artificial cultural construct.",
    "Memory merely stores and reproduces received data, whereas judgment involves the critical discernment and evaluation of meaning.",
    "Judgment is morally inferior to memory because it requires emotional detachment.",
    "Those who lack memory inevitably develop superior political instincts for statecraft."
  ],
  "correct_answer": "Memory merely stores and reproduces received data, whereas judgment involves the critical discernment and evaluation of meaning.",
  "explanation": "Montaigne separates the rote capacity to retain information (memory) from the intellectual power to weigh, analyze, and make wise decisions (judgment).",
  "points": 1,
  "order_index": 2
},
  {
  "id": "66666666-6666-4666-8666-000000000004",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Which of the following, if true, would most seriously weaken Montaigne's contention that poor memory protects an individual from political ambition?",
  "question_type": "multiple_choice",
  "options": [
    "Many highly successful political leaders rely primarily on competent secretarial staff and written archives rather than unassisted biological recall.",
    "Philosophers frequently disagree about the neurological seat of mnemonic faculties.",
    "Ancient rhetoricians placed high value on the 'method of loci' for memorizing speeches.",
    "Some individuals with exceptional memories also exhibit strong mathematical aptitude."
  ],
  "correct_answer": "Many highly successful political leaders rely primarily on competent secretarial staff and written archives rather than unassisted biological recall.",
  "explanation": "If leaders can outsource memory to institutional aides and records, a personal deficiency in memory ceases to be an 'intolerable defect' blocking political ambition.",
  "points": 1,
  "order_index": 3
},
  {
  "id": "66666666-6666-4666-8666-000000000005",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'Human memory does not function like a video recording that passively captures reality to be played back with fidelity. Rather, as Elizabeth Loftus demonstrated in her landmark 1974 experiments, memory is fundamentally reconstructive. When subjects viewed a film of a car collision, those asked how fast the vehicles were moving when they \"smashed\" into each other estimated significantly higher speeds than those asked when they \"hit\" each other. A week later, subjects in the \"smashed\" cohort were far more likely to falsely recall seeing broken glass at the scene, despite no broken glass existing in the film.'\n\nWhat is the central implication of Loftus's findings for the legal concept of eyewitness testimony?",
  "question_type": "multiple_choice",
  "options": [
    "Witnesses who describe high speeds are invariably committing deliberate perjury in court.",
    "Post-event suggestions and questioning terminology can invisibly alter a witness's genuine recollection of factual occurrences.",
    "Automobile collisions cannot be adjudicated without telemetry sensor data.",
    "Physical evidence is inherently more prone to subjective contamination than oral testimony."
  ],
  "correct_answer": "Post-event suggestions and questioning terminology can invisibly alter a witness's genuine recollection of factual occurrences.",
  "explanation": "Loftus's work proves the 'misinformation effect': leading phrasing does not just alter immediate verbal answers, but integrates into and corrupts the underlying memory.",
  "points": 1,
  "order_index": 4
},
  {
  "id": "66666666-6666-4666-8666-000000000006",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Based on the passage, the false recollection of broken glass illustrates that:",
  "question_type": "multiple_choice",
  "options": [
    "Semantic associations of violent impact can overwrite sensory perceptual memory with congruent imagined details.",
    "Human visual perception is systematically blinded by bright kinetic motion.",
    "Experimental subjects always seek to appease academic researchers.",
    "Memory retention deteriorates linearly after precisely seven days."
  ],
  "correct_answer": "Semantic associations of violent impact can overwrite sensory perceptual memory with congruent imagined details.",
  "explanation": "The verb 'smashed' triggered schema-driven expectations of severe destruction (broken glass), which the brain integrated into the reconstructed episodic memory.",
  "points": 1,
  "order_index": 5
},
  {
  "id": "66666666-6666-4666-8666-000000000007",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Which of the following courtroom practices is most directly justified by Loftus's findings on reconstructive memory?",
  "question_type": "multiple_choice",
  "options": [
    "The evidentiary prohibition against asking leading questions during direct examination.",
    "The elimination of peremptory challenges during jury selection.",
    "The mandatory imposition of minimum custodial sentences for road traffic offenses.",
    "The introduction of lie detector polygraphs into formal trial proceedings."
  ],
  "correct_answer": "The evidentiary prohibition against asking leading questions during direct examination.",
  "explanation": "Leading questions suggest the desired answer to the witness, risking the subconscious contamination and reconstruction of their testimony.",
  "points": 1,
  "order_index": 6
},
  {
  "id": "66666666-6666-4666-8666-000000000008",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "A prosecutor argues: 'The eyewitness has expressed absolute certainty that the defendant was the gunman; therefore, any possibility of misidentification is eliminated.' Which logical fallacy does this argument commit in light of psychological research on memory?",
  "question_type": "multiple_choice",
  "options": [
    "Equating subjective subjective confidence with objective historical accuracy.",
    "Committing an ad hominem attack against defense counsel.",
    "Assuming that absence of physical evidence proves innocence.",
    "Confusing statutory necessity with discretionary executive power."
  ],
  "correct_answer": "Equating subjective subjective confidence with objective historical accuracy.",
  "explanation": "Empirical studies consistently show a weak correlation between witness certainty and actual identification accuracy, particularly after repeated police questioning.",
  "points": 1,
  "order_index": 7
},
  {
  "id": "66666666-6666-4666-8666-000000000009",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'In R v Turnbull (1977), the English Court of Appeal established mandatory judicial directions where the prosecution's case relies substantially on contested identification evidence. The trial judge must warn the jury of the special need for caution, emphasizing that an honest and convincing witness may nonetheless be mistaken. The judge must assess the quality of the observation—analyzing factors such as the duration of the sighting, distance, lighting conditions, whether the observation was impeded, whether the witness had previously known the accused, and the interval between the event and the formal identification.'\n\nWhat was the primary policy motivation underlying the Court of Appeal's ruling in R v Turnbull?",
  "question_type": "multiple_choice",
  "options": [
    "To abolish the use of uncorroborated eyewitness identifications in all criminal trials.",
    "To mitigate the chronic systemic risk of wrongful convictions stemming from sincere but mistaken eyewitness testimony.",
    "To expedite judicial proceedings by restricting the length of defense cross-examinations.",
    "To transfer the ultimate burden of evaluating guilt from the jury to the presiding judge."
  ],
  "correct_answer": "To mitigate the chronic systemic risk of wrongful convictions stemming from sincere but mistaken eyewitness testimony.",
  "explanation": "The Turnbull guidelines were formulated following high-profile miscarriages of justice (such as Beck and Dougherty) where confident, honest witnesses had identified innocent people.",
  "points": 1,
  "order_index": 8
},
  {
  "id": "66666666-6666-4666-8666-000000000010",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Under the Turnbull doctrine, when the quality of the identification is deemed exceptionally poor (e.g., a fleeting glimpse in darkness) and lacks supporting corroborative evidence, what action should the trial judge take?",
  "question_type": "multiple_choice",
  "options": [
    "Withdraw the case from the jury and direct an acquittal.",
    "Adjourn the trial indefinitely until DNA evidence can be obtained.",
    "Compel the defendant to testify under oath to clarify their whereabouts.",
    "Permit the jury to convict provided they reach an absolute unanimous verdict."
  ],
  "correct_answer": "Withdraw the case from the jury and direct an acquittal.",
  "explanation": "Turnbull explicitly rules that where the identification is poor and unsupported by other evidence, the judge must withdraw the case to prevent an unsafe verdict.",
  "points": 1,
  "order_index": 9
},
  {
  "id": "66666666-6666-4666-8666-000000000011",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Which of the following factors from the Turnbull guidelines accounts for the psychological phenomenon of 'memory decay'?",
  "question_type": "multiple_choice",
  "options": [
    "The duration of the initial visual observation.",
    "The lighting conditions at the locus of the crime.",
    "The time interval elapsed between the event and the formal identification procedure.",
    "Whether the perpetrator possessed unusual facial features."
  ],
  "correct_answer": "The time interval elapsed between the event and the formal identification procedure.",
  "explanation": "The delay between the witnessed incident and the police lineup directly correlates with decay and potential external interference in the witness's mental representation.",
  "points": 1,
  "order_index": 10
},
  {
  "id": "66666666-6666-4666-8666-000000000012",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "A critic of sequential photo lineups argues: 'Simultaneous lineups allow witnesses to compare faces directly, which feels more natural to human intuition.' What is the cognitive rebuttal to this argument?",
  "question_type": "multiple_choice",
  "options": [
    "Simultaneous presentation encourages 'relative judgment' (picking the face that looks most like the culprit relative to the others), increasing false positive identifications.",
    "Sequential lineups require digital computer monitors that are vulnerable to electrical failures.",
    "Direct facial comparison is prohibited by international human rights conventions.",
    "Human faces cannot be perceived when viewed in isolation from body silhouettes."
  ],
  "correct_answer": "Simultaneous presentation encourages 'relative judgment' (picking the face that looks most like the culprit relative to the others), increasing false positive identifications.",
  "explanation": "In simultaneous lineups, witnesses compare suspects to each other (relative judgment), whereas sequential lineups force an absolute judgment comparing each photo to their memory.",
  "points": 1,
  "order_index": 11
},
  {
  "id": "66666666-6666-4666-8666-000000000013",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'The 2009 National Academy of Sciences (NAS) report delivered a devastating appraisal of forensic disciplines long revered in trial courts. With the sole exception of nuclear DNA analysis, no forensic method—including latent fingerprint comparison, microscopic hair examination, bite-mark identification, or tool-mark matching—has been rigorously validated to establish individualization. Furthermore, forensic examiners are routinely subjected to cognitive contextual bias. When fingerprint analysts were presented with pairs of prints they had previously declared a \"match\", but were now told that the suspect had an ironclad alibi, a significant proportion reversed their original determinations.'\n\nWhat does the contextual bias experiment described in the passage demonstrate about forensic fingerprint analysis?",
  "question_type": "multiple_choice",
  "options": [
    "Fingerprint ridges change shape over time due to atmospheric oxidation.",
    "Visual pattern interpretation in forensic analysis is subjective and can be swayed by non-pertinent extraneous case information.",
    "Nuclear DNA analysis is equally susceptible to optical distortion.",
    "All forensic scientists intentionally falsify evidence to assist prosecution teams."
  ],
  "correct_answer": "Visual pattern interpretation in forensic analysis is subjective and can be swayed by non-pertinent extraneous case information.",
  "explanation": "The experiment proved that the subjective perceptual threshold of what constitutes a 'match' shifts when examiners are influenced by extraneous investigative context.",
  "points": 1,
  "order_index": 12
},
  {
  "id": "66666666-6666-4666-8666-000000000014",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "According to the NAS report cited, what fundamentally separates nuclear DNA analysis from disciplines like bite-mark or microscopic hair analysis?",
  "question_type": "multiple_choice",
  "options": [
    "Nuclear DNA has a validated population genetics database and quantifiable, scientifically tested error rates.",
    "DNA samples never degrade under ambient environmental exposure.",
    "Bite-mark analysis is exclusively practiced by certified medical coroners.",
    "DNA matching does not require specialized laboratory equipment."
  ],
  "correct_answer": "Nuclear DNA has a validated population genetics database and quantifiable, scientifically tested error rates.",
  "explanation": "DNA profiling rests on rigorous molecular biology and statistical population genetics with known random match probabilities, unlike pattern-matching disciplines.",
  "points": 1,
  "order_index": 13
},
  {
  "id": "66666666-6666-4666-8666-000000000015",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Which practical reform in forensic laboratories would most effectively counteract the contextual bias revealed in the passage?",
  "question_type": "multiple_choice",
  "options": [
    "Linear Sequential Unmasking (LSU), where analysts must fully document the latent evidence before seeing any suspect reference print or contextual case details.",
    "Allowing police detectives to directly oversee forensic technicians during microscope examinations.",
    "Replacing jury trials with bench trials whenever forensic evidence is introduced.",
    "Prohibiting defense experts from conducting independent tests on physical evidence."
  ],
  "correct_answer": "Linear Sequential Unmasking (LSU), where analysts must fully document the latent evidence before seeing any suspect reference print or contextual case details.",
  "explanation": "LSU ensures examiners analyze and characterize evidence 'blindly' before exposure to biasing suspect information or external investigative narratives.",
  "points": 1,
  "order_index": 14
},
  {
  "id": "66666666-6666-4666-8666-000000000016",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "An expert witness testifies: 'The probability of two people sharing this exact microscopic hair profile is zero.' Which critical assertion does this statement unjustifiably make?",
  "question_type": "multiple_choice",
  "options": [
    "An unverified claim of unique individualization unsupported by empirical population frequency data.",
    "A concession that the defendant was not present at the crime scene.",
    "A violation of the statutory hearsay exclusion rule.",
    "An admission that the microscopic instrument was miscalibrated."
  ],
  "correct_answer": "An unverified claim of unique individualization unsupported by empirical population frequency data.",
  "explanation": "Microscopic hair examination has no scientific baseline for calculating population rarity; asserting a zero match probability is scientifically ungrounded hyperbole.",
  "points": 1,
  "order_index": 15
},
  {
  "id": "66666666-6666-4666-8666-000000000017",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'In his 1765 Commentaries on the Laws of England, Sir William Blackstone famously declared: \"It is better that ten guilty persons escape, than that one innocent suffer.\" This maxim embodies the normative cornerstone of Anglo-American criminal law: an intentional structural asymmetry designed to minimize Type I errors (false convictions) even at the cost of tolerating Type II errors (false acquittals). Utilitarian critics, however, challenge the proportionality of the ratio. If an escaped violent offender commits multiple subsequent murders, does the aggregate suffering inflicted upon innocent victims not surpass the injustice of a single wrongful conviction?'\n\nWhat is the core normative premise underlying Blackstone's ratio?",
  "question_type": "multiple_choice",
  "options": [
    "The moral culpability of an individual offender decreases over time.",
    "State-sponsored punishment of an innocent person constitutes a qualitatively graver systemic injustice than the failure of the state to punish a private criminal.",
    "Guilty individuals will inevitably be brought to justice through natural or spiritual retribution.",
    "The financial expense of housing inmates exceeds the social cost of unsolved crimes."
  ],
  "correct_answer": "State-sponsored punishment of an innocent person constitutes a qualitatively graver systemic injustice than the failure of the state to punish a private criminal.",
  "explanation": "Blackstone's principle holds that when the state—with its monopoly on violence and moral authority—punishes an innocent, it subverts the foundational legitimacy of the legal order.",
  "points": 1,
  "order_index": 16
},
  {
  "id": "66666666-6666-4666-8666-000000000018",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "In the terminology of statistical hypothesis testing, how does criminal jurisprudence classify a wrongful conviction?",
  "question_type": "multiple_choice",
  "options": [
    "A Type I error (rejecting the null hypothesis of innocence when it is in fact true).",
    "A Type II error (failing to reject the null hypothesis of innocence when the defendant is guilty).",
    "A sampling bias error caused by non-random jury selection.",
    "A regression to the mean in forensic probability calculation."
  ],
  "correct_answer": "A Type I error (rejecting the null hypothesis of innocence when it is in fact true).",
  "explanation": "Because the legal presumption starts with innocence as the null hypothesis, convicting an innocent person is a false positive, or Type I error.",
  "points": 1,
  "order_index": 17
},
  {
  "id": "66666666-6666-4666-8666-000000000019",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "How would a consistent consequentialist utilitarian assess Blackstone's ratio?",
  "question_type": "multiple_choice",
  "options": [
    "Reject any fixed numerical ratio in favor of an empirical calculation maximizing aggregate social utility and crime deterrence.",
    "Demand that all criminal trials be resolved under the civil 'balance of probabilities' standard.",
    "Insist that capital punishment be abolished universally regardless of deterrence data.",
    "Argue that victim satisfaction should be the exclusive determinant of sentencing length."
  ],
  "correct_answer": "Reject any fixed numerical ratio in favor of an empirical calculation maximizing aggregate social utility and crime deterrence.",
  "explanation": "Utilitarianism evaluates policies by their overall consequences; if letting ten violent felons free produces far more net misery than one wrongful imprisonment, utilitarians would revise the ratio.",
  "points": 1,
  "order_index": 18
},
  {
  "id": "66666666-6666-4666-8666-000000000020",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Which legal mechanism directly Operationalizes the normative prioritization expressed in Blackstone's ratio within modern common-law courtrooms?",
  "question_type": "multiple_choice",
  "options": [
    "The requirement that the prosecution establish criminal guilt 'beyond reasonable doubt'.",
    "The discretion of prosecutors to enter a nolle prosequi.",
    "The statutory limit on jury trial durations in magistrate courts.",
    "The doctrine of precedent (stare decisis) in appellate rulings."
  ],
  "correct_answer": "The requirement that the prosecution establish criminal guilt 'beyond reasonable doubt'.",
  "explanation": "The heightened burden of proof ('beyond reasonable doubt') creates an evidentiary barrier intentionally calibrated to avoid convicting the innocent.",
  "points": 1,
  "order_index": 19
},
  {
  "id": "66666666-6666-4666-8666-000000000021",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'Advancements in functional Magnetic Resonance Imaging (fMRI) have fueled claims by commercial neuro-technology firms that neural blood-oxygenation patterns can definitively reveal whether a subject is lying or recognizing a crime scene. Legal scholars, however, observe that compelled fMRI scans threaten to rupture the boundary between physical evidence (such as blood samples or fingerprints, which can be lawfully compelled) and testimonial evidence (communications from an accused's mental cognition, protected by the privilege against self-incrimination). When a machine directly decodes propositional knowledge stored within the brain, the boundary between an object to be inspected and a witness testifying against oneself collapses.'\n\nWhat is the central constitutional tension identified in the passage regarding compelled neuroimaging?",
  "question_type": "multiple_choice",
  "options": [
    "Whether neural hemodynamic responses should be categorized as non-testimonial physical attributes or as protected cognitive testimony.",
    "Whether the high monetary cost of MRI machines violates judicial budget caps.",
    "Whether radiologists possess statutory immunity from civil malpractice claims.",
    "Whether MRI magnetic fields disrupt electronic court reporting devices."
  ],
  "correct_answer": "Whether neural hemodynamic responses should be categorized as non-testimonial physical attributes or as protected cognitive testimony.",
  "explanation": "Self-incrimination doctrine protects the contents of a suspect's mind (testimony), but allows taking bodily samples (physical evidence); fMRI extracts mental content via physical brain scans.",
  "points": 1,
  "order_index": 20
},
  {
  "id": "66666666-6666-4666-8666-000000000022",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Under the Daubert standard for scientific evidence, which of the following poses the most formidable barrier to the admissibility of fMRI lie detection?",
  "question_type": "multiple_choice",
  "options": [
    "The lack of general scientific acceptance within the cognitive neuroscience community and unproven ecological validity outside laboratory settings.",
    "The requirement that all trial evidence be legible in printed textual format.",
    "The rule that only licensed police officers may operate trial technology.",
    "The constitutional prohibition against using electricity inside courtroom chambers."
  ],
  "correct_answer": "The lack of general scientific acceptance within the cognitive neuroscience community and unproven ecological validity outside laboratory settings.",
  "explanation": "Daubert requires peer review, general acceptance, and known error rates in real-world conditions; lab-based fMRI deception tasks have not been validated for high-stakes real crimes.",
  "points": 1,
  "order_index": 21
},
  {
  "id": "66666666-6666-4666-8666-000000000023",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "If a subject displays neural recognition upon viewing a murder weapon during a 'brain fingerprinting' test, which plausible alternative explanation undermines the inference that they are the killer?",
  "question_type": "multiple_choice",
  "options": [
    "The subject may have viewed identical weapons in media coverage or possessed a similar tool innocently.",
    "The human brain ceases generating electric potentials when confronted with violent stimuli.",
    "fMRI detectors cannot function if a subject blinks their eyes.",
    "Blood oxygen levels always plummet uniformly across the prefrontal cortex during stress."
  ],
  "correct_answer": "The subject may have viewed identical weapons in media coverage or possessed a similar tool innocently.",
  "explanation": "Brain-wave or fMRI recognition reveals only familiarity with the image, not the moral or episodic context in which the familiarity was acquired.",
  "points": 1,
  "order_index": 22
},
  {
  "id": "66666666-6666-4666-8666-000000000024",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'Formulated following the 1843 trial of Daniel M'Naghten, the English insanity defense rules require establishing that at the time of committing the act, the accused labored under such a defect of reason, from disease of the mind, as not to know the nature and quality of the act he was doing; or, if he did know it, that he did not know he was doing what was wrong. Critics have long argued that this cognitive test ignores volitional and emotional defects: an individual suffering from paranoid psychosis may be fully aware that killing is prohibited by law, yet remain utterly powerless to resist an irresistible command hallucination.'\n\nWhat is the fundamental limitation of the M'Naghten test highlighted by modern psychiatric jurisprudence?",
  "question_type": "multiple_choice",
  "options": [
    "It focuses strictly on cognitive comprehension while failing to accommodate volitional impairment or loss of behavioral self-control.",
    "It requires defendants to possess a formal medical university degree.",
    "It applies solely to offenses committed against members of the royal family.",
    "It automatically exonerates anyone who experiences temporary depression."
  ],
  "correct_answer": "It focuses strictly on cognitive comprehension while failing to accommodate volitional impairment or loss of behavioral self-control.",
  "explanation": "M'Naghten hinges purely on intellectual knowing ('did he know the nature/wrongness of the act?'), excluding individuals whose severe illness destroys their ability to control their actions.",
  "points": 1,
  "order_index": 23
},
  {
  "id": "66666666-6666-4666-8666-000000000025",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "In R v Windle (1952), the defendant administered an overdose to his terminally ill wife and remarked to police: 'I suppose they will hang me for this.' Why did the court reject his insanity defense under M'Naghten?",
  "question_type": "multiple_choice",
  "options": [
    "His statement demonstrated that he understood the act was contrary to positive criminal law, satisfying the cognitive test of knowing it was 'wrong'.",
    "Terminally ill victims are excluded from homicide statutes.",
    "The defendant failed to pay the required court filing fees.",
    "His alibi was contradicted by multiple independent witnesses."
  ],
  "correct_answer": "His statement demonstrated that he understood the act was contrary to positive criminal law, satisfying the cognitive test of knowing it was 'wrong'.",
  "explanation": "In English law, 'wrong' in M'Naghten means legally wrong; Windle's statement showed he knew the law forbade his act, barring the insanity defense despite his severe mental illness.",
  "points": 1,
  "order_index": 24
},
  {
  "id": "66666666-6666-4666-8666-000000000026",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "How does the doctrine of 'diminished responsibility' under the Homicide Act 1957 modify the rigid binary of the M'Naghten rules in murder cases?",
  "question_type": "multiple_choice",
  "options": [
    "It provides a partial defense that reduces a murder conviction to voluntary manslaughter, recognizing substantial impairment without requiring total cognitive blindness.",
    "It mandates immediate unconditional release for all psychotic defendants.",
    "It shifts the burden of proof onto the trial judge rather than the jury.",
    "It eliminates the necessity of proving the actus reus of the crime."
  ],
  "correct_answer": "It provides a partial defense that reduces a murder conviction to voluntary manslaughter, recognizing substantial impairment without requiring total cognitive blindness.",
  "explanation": "Diminished responsibility acts as a compassionate middle ground, avoiding the mandatory life sentence for murder when a recognized condition substantially impairs mental functioning.",
  "points": 1,
  "order_index": 25
},
  {
  "id": "66666666-6666-4666-8666-000000000027",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'The Reid Technique of police interrogation relies on a nine-step process combining psychological maximization and minimization. Interrogators confront the suspect with unyielding assertions of guilt, reject all denials, and fabricate fictitious evidence (such as asserting that a co-conspirator has already confessed). Concurrently, they offer moral rationalizations and minimize the culpability of the offense, subtly implying that cooperation will yield leniency. While effective at extracting admissions, Innocence Project data reveals that nearly 30% of DNA-exonerated individuals had initially falsely confessed to serious violent crimes under coercive psychological interrogation.'\n\nWhich psychological mechanism best explains why an innocent person would falsely confess to a crime they did not commit during a Reid-style interrogation?",
  "question_type": "multiple_choice",
  "options": [
    "Temporal discounting: the acute, immediate desire to escape unrelenting psychological interrogation distress outweighs perceived future risks of legal punishment.",
    "A sudden biological onset of retrograde amnesia induced by room lighting.",
    "An altruistic desire to receive fame through notorious criminal publicity.",
    "A complete loss of phonetic comprehension of legal language."
  ],
  "correct_answer": "Temporal discounting: the acute, immediate desire to escape unrelenting psychological interrogation distress outweighs perceived future risks of legal punishment.",
  "explanation": "Exhausted suspects experience intense stress and short-sightedness; falsely confessing appears to be the only available exit from an agonizing immediate ordeal.",
  "points": 1,
  "order_index": 26
},
  {
  "id": "66666666-6666-4666-8666-000000000028",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "In the United Kingdom, the Police and Criminal Evidence Act 1984 (PACE) replaced confrontational interrogation methods with the PEACE model. What is the fundamental operational difference of PEACE?",
  "question_type": "multiple_choice",
  "options": [
    "It focuses on investigative information-gathering, non-coercive questioning, and open dialogue rather than extracting a pre-determined confession of guilt.",
    "It permits interrogators to administer pharmacological truth serums.",
    "It disallows suspects from speaking to legal counsel until after formal charging.",
    "It guarantees absolute immunity for any suspect who confesses within twenty minutes."
  ],
  "correct_answer": "It focuses on investigative information-gathering, non-coercive questioning, and open dialogue rather than extracting a pre-determined confession of guilt.",
  "explanation": "PEACE (Planning, Engage, Account, Closure, Evaluation) treats questioning as an objective inquiry to establish facts rather than a psychological contest to force a confession.",
  "points": 1,
  "order_index": 27
},
  {
  "id": "66666666-6666-4666-8666-000000000029",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Why is the tactic of police lying about non-existent physical evidence (e.g., claiming a suspect's DNA was found on the weapon) particularly dangerous in the case of juvenile suspects?",
  "question_type": "multiple_choice",
  "options": [
    "Adolescent neurodevelopment features heightened suggestibility, compliance with authority, and immature risk evaluation.",
    "Juveniles are legally exempt from all criminal statutes.",
    "Juvenile fingerprints undergo spontaneous molecular degradation within hours.",
    "Children lack the cognitive capacity to experience fear of imprisonment."
  ],
  "correct_answer": "Adolescent neurodevelopment features heightened suggestibility, compliance with authority, and immature risk evaluation.",
  "explanation": "Developmental psychology shows that young brains are far more deferential to authority figures and susceptible to believing false authority claims about evidence.",
  "points": 1,
  "order_index": 28
},
  {
  "id": "66666666-6666-4666-8666-000000000030",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Under English criminal evidence law, Section 76 of PACE requires the trial judge to exclude confession evidence if it was obtained:",
  "question_type": "multiple_choice",
  "options": [
    "By oppression, or in consequence of anything said or done likely to render the confession unreliable.",
    "Without a minimum of four independent civilian witnesses present.",
    "Outside the geographic boundaries of London.",
    "In the presence of any female police officers."
  ],
  "correct_answer": "By oppression, or in consequence of anything said or done likely to render the confession unreliable.",
  "explanation": "Section 76 PACE is the statutory safeguard mandating exclusion of confessions extracted via oppression or circumstances undermining evidentiary reliability.",
  "points": 1,
  "order_index": 29
},
  {
  "id": "66666666-6666-4666-8666-000000000031",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'Consider legal philosopher Charles Nesson's famous \"Gatecrasher Paradox\". One thousand spectators attend an exhibition rodeo. The gate receipts show that only 499 individuals purchased entry tickets, meaning that 501 gatecrashed without paying. The promoter sues an arbitrary spectator picked at random from the crowd. Statistically, there is an exact 50.1% probability that this spectator is a gatecrasher. In civil law, the burden of proof is the balance of probabilities (>50%). Yet, courts universally refuse to find liability based solely on naked statistical population proportions. Legal proof requires individualized, case-specific evidence connecting the defendant directly to the wrongful act.'\n\nWhat epistemic principle is illuminated by the Gatecrasher Paradox?",
  "question_type": "multiple_choice",
  "options": [
    "Mathematical probability alone is insufficient for judicial proof; evidence must establish an individualized causal nexus to the specific defendant.",
    "Rodeo promoters should not be granted civil standing in common-law courts.",
    "The balance of probabilities standard should be numerically defined as precisely 99.9%.",
    "Statistically grounded evidence is always inadmissible in both civil and criminal litigation."
  ],
  "correct_answer": "Mathematical probability alone is insufficient for judicial proof; evidence must establish an individualized causal nexus to the specific defendant.",
  "explanation": "The paradox demonstrates that law rejects 'naked statistical evidence' because imposing liability without case-specific evidence undermines justice and public confidence.",
  "points": 1,
  "order_index": 30
},
  {
  "id": "66666666-6666-4666-8666-000000000032",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "If a court accepted pure demographic statistics as satisfying the civil standard of proof in the Gatecrasher scenario, what absurd systemic outcome would follow?",
  "question_type": "multiple_choice",
  "options": [
    "The promoter could sue and win against every single attendee in the arena, extracting payment 1,000 times even though 499 had already paid.",
    "All criminal cases would immediately be dismissed for lack of statutory jurisdiction.",
    "Spectators would be legally mandated to wear digital tracking wristbands at all sporting events.",
    "The judge would be liable for personal bankruptcy."
  ],
  "correct_answer": "The promoter could sue and win against every single attendee in the arena, extracting payment 1,000 times even though 499 had already paid.",
  "explanation": "If 50.1% probability sufficed against one random person, it would suffice against every person, allowing recovery against the 499 entirely innocent paying customers.",
  "points": 1,
  "order_index": 31
},
  {
  "id": "66666666-6666-4666-8666-000000000033",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "What is the 'Prosecutor's Fallacy' in statistical evaluation of criminal evidence?",
  "question_type": "multiple_choice",
  "options": [
    "Confusing the probability of the evidence given the defendant's innocence with the probability of the defendant's innocence given the evidence.",
    "Assuming that every eyewitness is intentionally attempting to deceive the jury.",
    "Failing to disclose defense expert fees during cross-examination.",
    "Arguing that circumstantial evidence has greater probative weight than direct video footage."
  ],
  "correct_answer": "Confusing the probability of the evidence given the defendant's innocence with the probability of the defendant's innocence given the evidence.",
  "explanation": "Transposing the conditional probability (P(Evidence|Innocence) vs P(Innocence|Evidence)) mistakenly treats a rare DNA match probability as the direct probability of the defendant being innocent.",
  "points": 1,
  "order_index": 32
},
  {
  "id": "66666666-6666-4666-8666-000000000034",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "In the tragic UK cot-death case R v Sally Clark (2003), pediatrician Sir Roy Meadow testified that the chance of two sudden infant deaths in one affluent family was 1 in 73 million, calculated by squaring the 1 in 8,500 single-death rate. What fundamental statistical error did this calculation commit?",
  "question_type": "multiple_choice",
  "options": [
    "Assuming statistical independence between two events that likely shared underlying genetic or environmental risk factors.",
    "Dividing the numerator by an irrational square root.",
    "Using decimal numbers instead of whole fractions in testimony.",
    "Misidentifying the biological gender of the deceased infants."
  ],
  "correct_answer": "Assuming statistical independence between two events that likely shared underlying genetic or environmental risk factors.",
  "explanation": "Events can only be multiplied if independent; infant deaths in the same household share hereditary genetics and familial environment, rendering the 1 in 73 million figure wildly inaccurate.",
  "points": 1,
  "order_index": 33
},
  {
  "id": "66666666-6666-4666-8666-000000000035",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'The proliferation of generative artificial intelligence and hyper-realistic deepfake technology threatens judicial proceedings with a double-edged crisis known as the \"liar's dividend\". First, fabricated audio and video recordings may be admitted as genuine, misleading triers of fact. Second, and perhaps more insidiously, truly authentic video recordings of criminal wrongdoing can now be plausibly disbelieved by juries because guilty defendants can claim the footage is merely an AI-generated synthetic forgery.'\n\nWhat is the 'liar's dividend' described in the passage?",
  "question_type": "multiple_choice",
  "options": [
    "The tactical advantage gained by dishonest actors who exploit the mere existence of deepfakes to discredit genuine, incriminating evidence.",
    "A financial bonus awarded to defense attorneys who win acquittals through synthetic evidence.",
    "The statutory tax exemption enjoyed by AI technology software corporations.",
    "A reduction in sentencing guidelines for defendants who plead guilty early."
  ],
  "correct_answer": "The tactical advantage gained by dishonest actors who exploit the mere existence of deepfakes to discredit genuine, incriminating evidence.",
  "explanation": "The liar's dividend allows wrongdoers to evade accountability by exploiting public skepticism: since deepfakes exist, any real video can be dismissed as fake.",
  "points": 1,
  "order_index": 34
},
  {
  "id": "66666666-6666-4666-8666-000000000036",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "To combat synthetic media tampering, evidence law increasingly relies on 'cryptographic chain of custody'. What does this procedure verify?",
  "question_type": "multiple_choice",
  "options": [
    "The immutable provenance, timestamp, and hardware capture metadata of digital footage from the camera sensor to the courtroom.",
    "The psychological mental stability of the videographer at the moment of recording.",
    "The legal ownership of the copyrighted musical score playing in the background.",
    "The political party affiliation of the police evidence custodian."
  ],
  "correct_answer": "The immutable provenance, timestamp, and hardware capture metadata of digital footage from the camera sensor to the courtroom.",
  "explanation": "Cryptographic hashing and verifiable metadata guarantee that a digital file has not been altered or synthesized since the moment it was recorded.",
  "points": 1,
  "order_index": 35
},
  {
  "id": "66666666-6666-4666-8666-000000000037",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "If courts respond to the deepfake crisis by reinstating a rigid requirement that all events be proven by live human eyewitnesses rather than recordings, what historical vulnerability do they re-introduce?",
  "question_type": "multiple_choice",
  "options": [
    "The well-documented fallibility, suggestibility, and memory decay of human perception.",
    "The absolute elimination of all trial appeals.",
    "An uncontrollable escalation in courtroom building heating costs.",
    "The automatic decriminalization of commercial fraud."
  ],
  "correct_answer": "The well-documented fallibility, suggestibility, and memory decay of human perception.",
  "explanation": "Reverting solely to human testimony would replace the risk of digital forgery with the well-known biological distortions of memory established by psychological research.",
  "points": 1,
  "order_index": 36
},
  {
  "id": "66666666-6666-4666-8666-000000000038",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'The common-law jury of twelve citizens is celebrated by Lord Devlin as \"the lamp that shows that freedom lives.\" However, empirical social psychology reveals troubling cognitive dynamics in jury deliberations. Studies demonstrate \"group polarization\": when jurors lean mildly toward a particular verdict prior to deliberation, group discussion often magnifies their collective confidence and drives them to an extreme, polarized stance. Furthermore, lay jurors frequently struggle with complex epidemiological and statistical evidence, defaulting to intuitive narrative coherence rather than probabilistic calculus.'\n\nWhat does the phenomenon of 'group polarization' imply about jury deliberations?",
  "question_type": "multiple_choice",
  "options": [
    "Deliberation does not always temper extreme views through balanced consensus, but can reinforce and amplify initial preconceptions.",
    "Jurors always split into precisely two equal halves of six votes each.",
    "All twelve jurors inevitably forget the judge's instructions within thirty minutes.",
    "Jury verdicts in common-law nations are statistically indistinguishable from coin tosses."
  ],
  "correct_answer": "Deliberation does not always temper extreme views through balanced consensus, but can reinforce and amplify initial preconceptions.",
  "explanation": "Social psychological research proves that group discussion often causes individuals to adopt more extreme versions of their initial shared inclinations.",
  "points": 1,
  "order_index": 37
},
  {
  "id": "66666666-6666-4666-8666-000000000039",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "When lay jurors evaluate competing accounts of a crime, what does the psychological 'Story Model' (Pennington & Hastie) predict they will do?",
  "question_type": "multiple_choice",
  "options": [
    "Construct a narrative that creates a coherent causal story aligning with their personal world knowledge, even inserting unproven assumptions to fill evidentiary gaps.",
    "Compute Bayes' theorem using paper and pencils in the jury room.",
    "Accept whichever attorney speaks with a deeper vocal timbre.",
    "Disregard all witness testimony in favor of police press releases."
  ],
  "correct_answer": "Construct a narrative that creates a coherent causal story aligning with their personal world knowledge, even inserting unproven assumptions to fill evidentiary gaps.",
  "explanation": "The Story Model shows that jurors organize evidence into comprehensive stories, valuing narrative plausibility and completeness over rigorous probabilistic analysis.",
  "points": 1,
  "order_index": 38
},
  {
  "id": "66666666-6666-4666-8666-000000000040",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Which structural argument best justifies retaining lay juries despite cognitive biases?",
  "question_type": "multiple_choice",
  "options": [
    "Juries inject democratic community standards of justice, prevent judicial tyranny, and confer civic legitimacy on the deprivation of liberty.",
    "Juries are cheaper to operate than salaried professional judges.",
    "Jury verdicts never require formal sentencing hearings.",
    "Twelve citizens never experience tiredness during lengthy trials."
  ],
  "correct_answer": "Juries inject democratic community standards of justice, prevent judicial tyranny, and confer civic legitimacy on the deprivation of liberty.",
  "explanation": "The constitutional justification for the jury is political and democratic: it distributes sovereign punitive power across society and checks state overreach.",
  "points": 1,
  "order_index": 39
},
  {
  "id": "66666666-6666-4666-8666-000000000041",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "Passage Excerpt: 'Classical retributivism, articulated by Immanuel Kant, posits that punishment is a categorical moral imperative: the offender must suffer punishment proportional to their desert, irrespective of whether it yields any future rehabilitative or deterrent benefit. Conversely, restorative justice reframes crime not as a violation of an abstract state code, but as a rupture in interpersonal and community relationships. It prioritizes repairing harm through mediated dialogue, offender accountability, and victim restitution.'\n\nWhat is the fundamental difference in how retributive justice and restorative justice conceptualize the primary 'victim' of a crime?",
  "question_type": "multiple_choice",
  "options": [
    "Retributivism views crime primarily as an offense against the sovereign state and its legal order, whereas restorative justice views crime as harm inflicted on specific individuals and communities.",
    "Retributivism considers the offender to be the primary victim of societal neglect.",
    "Restorative justice refuses to acknowledge the existence of physical injury.",
    "Both frameworks reject the necessity of remorse or accountability."
  ],
  "correct_answer": "Retributivism views crime primarily as an offense against the sovereign state and its legal order, whereas restorative justice views crime as harm inflicted on specific individuals and communities.",
  "explanation": "In retributive law, the case is 'State v Accused' (breach of sovereign order); in restorative justice, the focus centers on repairing actual human relationships.",
  "points": 1,
  "order_index": 40
},
  {
  "id": "66666666-6666-4666-8666-000000000042",
  "test_id": "66666666-6666-4666-8666-666666666666",
  "question_text": "A defense attorney proposes resolving a violent domestic assault case exclusively through informal restorative community mediation without criminal charges. What is the most compelling feminist and victim-advocacy objection to this proposal?",
  "question_type": "multiple_choice",
  "options": [
    "Informal mediation risks reinforcing structural power imbalances and intimidating vulnerable victims into forced reconciliation without the coercive protection of state law.",
    "Restorative justice requires too many certified psychologists in attendance.",
    "Informal dialogue is prohibited under commercial contract legislation.",
    "Mediation eliminates the financial revenue generated by court fines."
  ],
  "correct_answer": "Informal mediation risks reinforcing structural power imbalances and intimidating vulnerable victims into forced reconciliation without the coercive protection of state law.",
  "explanation": "Where severe power and physical intimidation dynamics exist, informal mediation can coerce the victim, privatize serious violence, and deny equal protection under the criminal law.",
  "points": 1,
  "order_index": 41
},
  {
  "id": "77777777-7777-4777-8777-000000000001",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: '\"So what do you do?\" In almost every social gathering, this ubiquitous query serves as the primary currency of conversation. We define human status, worth, and identity almost entirely by participation in the formal wage-labor market. Yet, in his 1930 essay \"Economic Possibilities for our Grandchildren,\" John Maynard Keynes predicted that by the early twenty-first century, capital accumulation and technological progress would solve humanity's \"economic problem,\" reducing the working week to a mere fifteen hours. Instead of leisure and liberation, however, the modern economy has generated intense workplace burnout, hyper-specialization, and an explosion of what anthropologist David Graeber dubbed \"bullshit jobs\"—roles perceived as meaningless even by those who hold them.'\n\nWhat is the central paradox highlighted in the passage regarding Keynes's economic prediction?",
  "question_type": "multiple_choice",
  "options": [
    "Despite immense technological productivity growth that could enable widespread leisure, society has intensified work hours and manufactured superfluous administrative labor.",
    "Keynes failed to anticipate the invention of electronic calculating engines.",
    "Employees universally prefer working seventy hours per week to having free time.",
    "The working class has completely dismantled the global financial system."
  ],
  "correct_answer": "Despite immense technological productivity growth that could enable widespread leisure, society has intensified work hours and manufactured superfluous administrative labor.",
  "explanation": "Productivity soared as Keynes forecasted, but the expected 15-hour week never arrived; instead, culture and economic systems channeled the surplus into extended hours and administrative roles.",
  "points": 1,
  "order_index": 0
},
  {
  "id": "77777777-7777-4777-8777-000000000002",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "According to the passage, why is the social question 'So what do you do?' culturally revealing?",
  "question_type": "multiple_choice",
  "options": [
    "It demonstrates that individual social identity, moral dignity, and prestige remain inextricably tethered to one's occupation within market capitalism.",
    "It indicates that interpersonal etiquette has deteriorated since the Victorian era.",
    "It proves that modern citizens have lost the ability to discuss literature or philosophy.",
    "It reflects a mandatory government surveillance protocol for tax auditing."
  ],
  "correct_answer": "It demonstrates that individual social identity, moral dignity, and prestige remain inextricably tethered to one's occupation within market capitalism.",
  "explanation": "The author uses the opening question to underscore how human value in modern society is primarily measured through economic employment status.",
  "points": 1,
  "order_index": 1
},
  {
  "id": "77777777-7777-4777-8777-000000000003",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which of the following unstated assumptions was crucial to Keynes's prediction that technological productivity would lead to a fifteen-hour work week?",
  "question_type": "multiple_choice",
  "options": [
    "That human material desires would stabilize at a point of sufficiency rather than expanding into insatiable consumer appetites for new luxury goods.",
    "That national governments would outlaw private ownership of factories.",
    "That birth rates would fall to zero in developed economies.",
    "That international trade tariffs would be raised to prohibitive levels."
  ],
  "correct_answer": "That human material desires would stabilize at a point of sufficiency rather than expanding into insatiable consumer appetites for new luxury goods.",
  "explanation": "For reduced work hours to follow from increased efficiency, consumption needs must remain finite; if desires expand infinitely (consumerism), workers continue trading time for more goods.",
  "points": 1,
  "order_index": 2
},
  {
  "id": "77777777-7777-4777-8777-000000000004",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "An economic analyst argues: 'David Graeber's concept of \"bullshit jobs\" is purely subjective; if a corporation is willing to pay a salary, the role must generate market value by definition.' What economic assumption does this argument embody?",
  "question_type": "multiple_choice",
  "options": [
    "Neoclassical market orthodoxy that wages in equilibrium perfectly mirror marginal product, precluding corporate waste or institutional rent-seeking.",
    "The Marxist labor theory of surplus value.",
    "The Austrian school's critique of central monetary planning.",
    "The behavioral economics theory of loss aversion."
  ],
  "correct_answer": "Neoclassical market orthodoxy that wages in equilibrium perfectly mirror marginal product, precluding corporate waste or institutional rent-seeking.",
  "explanation": "This counter-argument assumes that profit-maximizing firms never hire inefficiently and that private market prices/wages flawlessly equate to real social utility.",
  "points": 1,
  "order_index": 3
},
  {
  "id": "77777777-7777-4777-8777-000000000005",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'In the classic Prisoner's Dilemma of game theory, two rational actors pursuing their uncoordinated self-interest inevitably reach a Nash equilibrium that is collectively suboptimal for both. This dilemma operates as a powerful paradigm for contemporary labor markets and international trade. When developing nations compete for foreign direct investment by slashing labor protections, tax rates, and environmental standards, they engage in a destructive \"race to the bottom\". Individually, each nation fears losing capital if it acts with unilateral moral restraint; collectively, all nations forfeit their public revenues and social safety nets.'\n\nWhat makes the 'race to the bottom' in international labor standards an analog of the Prisoner's Dilemma?",
  "question_type": "multiple_choice",
  "options": [
    "Uncoordinated rational self-interest by individual states produces a mutually destructive outcome that leaves all participants worse off than coordinated cooperation would.",
    "Participating nations are held in literal physical incarceration by international courts.",
    "Neither party has any economic incentive to attract foreign capital investment.",
    "The dilemma can only be resolved if one country conquerors all others militarily."
  ],
  "correct_answer": "Uncoordinated rational self-interest by individual states produces a mutually destructive outcome that leaves all participants worse off than coordinated cooperation would.",
  "explanation": "Just like the prisoners who both defect and receive worse sentences, countries undercutting each other to attract investment end up collectively gutting their welfare states.",
  "points": 1,
  "order_index": 4
},
  {
  "id": "77777777-7777-4777-8777-000000000006",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "According to game theory, what is the most robust structural remedy for escaping a Prisoner's Dilemma in international economic competition?",
  "question_type": "multiple_choice",
  "options": [
    "Binding multilateral conventions with credible enforcement mechanisms and monitoring to penalize defectors.",
    "Appealing solely to the ethical conscience of corporate chief executives.",
    "Abolishing the usage of sovereign national currencies.",
    "Restricting trade negotiations to secret bilateral phone calls."
  ],
  "correct_answer": "Binding multilateral conventions with credible enforcement mechanisms and monitoring to penalize defectors.",
  "explanation": "Cooperation in a prisoner's dilemma requires external enforcement or repeated-game sanctions so that defecting (undercutting standards) is no longer a dominant strategy.",
  "points": 1,
  "order_index": 5
},
  {
  "id": "77777777-7777-4777-8777-000000000007",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which of the following domestic labor policies mirrors the collective action solution to the Prisoner's Dilemma?",
  "question_type": "multiple_choice",
  "options": [
    "Statutory minimum wage legislation and mandatory collective bargaining agreements.",
    "Prohibiting trade unions from organizing workers in manufacturing plants.",
    "Replacing standard hourly pay with discretionary commission-only compensation.",
    "Exempting gig-economy companies from paying national health insurance taxes."
  ],
  "correct_answer": "Statutory minimum wage legislation and mandatory collective bargaining agreements.",
  "explanation": "Minimum wage laws prevent individual workers from being forced into desperate wage-undercutting competitions, setting a legally enforceable floor.",
  "points": 1,
  "order_index": 6
},
  {
  "id": "77777777-7777-4777-8777-000000000008",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "A free-market critic claims: 'If workers in developing nations accept low wages and dangerous conditions, it proves that these terms are preferred to their available alternatives.' What is the primary ethical counter-argument to this libertarian claim?",
  "question_type": "multiple_choice",
  "options": [
    "Coerced choices made under conditions of acute structural deprivation and lack of viable alternatives do not constitute genuine autonomous consent.",
    "Workers in developing nations do not understand basic arithmetic.",
    "Factory jobs produce lower GDP growth than subsistence farming.",
    "Multinational corporations operate at an ongoing financial loss in Asia."
  ],
  "correct_answer": "Coerced choices made under conditions of acute structural deprivation and lack of viable alternatives do not constitute genuine autonomous consent.",
  "explanation": "Bioethics and jurisprudence recognize that choosing the 'least terrible' among life-threatening options is an exercise in desperation under structural duress, not uncoerced autonomy.",
  "points": 1,
  "order_index": 7
},
  {
  "id": "77777777-7777-4777-8777-000000000009",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'In the landmark decision Uber BV v Aslam (2021), the UK Supreme Court addressed the legal fiction created by platform tech conglomerates. Uber insisted that its drivers were independent commercial contractors, characterizing its app merely as a digital booking agency facilitating transactions between private drivers and passengers. Lord Leggatt, delivering the unanimous judgment, firmly rejected this contractual formalism. The court held that statutory employment legislation was enacted specifically to protect vulnerable subordinates who have little or no ability to negotiate contractual terms. Because Uber exercised comprehensive algorithmic control—setting non-negotiable fares, imposing vehicle standards, monitoring ratings, and penalizing drivers who declined rides—the drivers were legally \"workers\" entitled to minimum wage and paid leave.'\n\nWhat was the decisive legal doctrine articulated by Lord Leggatt in Uber BV v Aslam regarding employment contracts?",
  "question_type": "multiple_choice",
  "options": [
    "Courts must look past formal written contractual labels drafted by employers to assess the practical reality of control and economic subordination.",
    "Any business that uses a mobile phone application is exempt from domestic employment laws.",
    "Independent contractors must be granted immediate seats on corporate boards of directors.",
    "Written contracts signed by consenting adults cannot be reviewed or challenged by tribunals."
  ],
  "correct_answer": "Courts must look past formal written contractual labels drafted by employers to assess the practical reality of control and economic subordination.",
  "explanation": "The Supreme Court ruled that statutory protections cannot be contracted out of by sophisticated corporate contract drafting; the courts examine the factual reality of subordination and control.",
  "points": 1,
  "order_index": 8
},
  {
  "id": "77777777-7777-4777-8777-000000000010",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "In English employment law, what is the crucial distinction between a 'worker' (Section 230(3)(b) Employment Rights Act 1996) and a traditional 'employee'?",
  "question_type": "multiple_choice",
  "options": [
    "Workers enjoy basic rights like national minimum wage, working time limits, and holiday pay, but lack protection against unfair dismissal and statutory redundancy pay.",
    "Workers are legally exempt from paying national income tax.",
    "Employees cannot be dismissed under any circumstances.",
    "Workers have no right to be accompanied at disciplinary hearings."
  ],
  "correct_answer": "Workers enjoy basic rights like national minimum wage, working time limits, and holiday pay, but lack protection against unfair dismissal and statutory redundancy pay.",
  "explanation": "'Worker' is an intermediate statutory tier giving core wage and holiday protections to dependent contractors without granting full employee rights like unfair dismissal protection.",
  "points": 1,
  "order_index": 9
},
  {
  "id": "77777777-7777-4777-8777-000000000011",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which aspect of Uber's algorithmic management was identified by the Supreme Court as evidence of subordinate control rather than entrepreneurial autonomy?",
  "question_type": "multiple_choice",
  "options": [
    "Uber's unilateral determination of the ride fare and restriction on drivers communicating directly with riders to establish independent business relations.",
    "The color scheme used in the app interface.",
    "Allowing drivers to select their own personal car insurance providers.",
    "The fact that drivers purchased their own mobile phone data plans."
  ],
  "correct_answer": "Uber's unilateral determination of the ride fare and restriction on drivers communicating directly with riders to establish independent business relations.",
  "explanation": "Entrepreneurs set their own prices and build client goodwill; Uber controlled the fare and insulated passengers from drivers, proving drivers were not running independent businesses.",
  "points": 1,
  "order_index": 10
},
  {
  "id": "77777777-7777-4777-8777-000000000012",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "A gig-economy food delivery platform argues: 'Because our couriers can log on and off whenever they choose, they cannot be classified as workers.' How did the Supreme Court resolve this issue regarding working time in Uber v Aslam?",
  "question_type": "multiple_choice",
  "options": [
    "Flexibility in choosing when to log on does not negate worker status; while logged on and available within the operating territory, drivers are working under the company's control.",
    "The court agreed that flexibility automatically converts all labor into voluntary charity.",
    "The court ruled that all couriers must be forced to work fixed eight-hour shifts.",
    "The court held that delivery couriers are maritime merchant seamen."
  ],
  "correct_answer": "Flexibility in choosing when to log on does not negate worker status; while logged on and available within the operating territory, drivers are working under the company's control.",
  "explanation": "The Supreme Court held that once drivers were logged into the app ready to accept jobs, they were at Uber's disposal and entitled to minimum wage for that time.",
  "points": 1,
  "order_index": 11
},
  {
  "id": "77777777-7777-4777-8777-000000000013",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'Universal Basic Income (UBI)—an unconditional, non-means-tested regular cash transfer paid to every adult citizen regardless of work status—has transitioned from radical utopian theory to mainstream economic debate. Advocates argue that by eliminating the punitive bureaucracy and \"welfare cliffs\" of means-tested systems (where earning a modest wage triggers an immediate withdrawal of benefits, creating effective marginal tax rates approaching 90%), UBI restores human dignity and empowers workers to reject dangerous or exploitative employment. Opponents counter with two arguments: astronomical fiscal cost requiring prohibitive taxation, and the moral risk of severing the social contract linking citizenship rights with reciprocal social contribution.'\n\nWhat is the 'welfare cliff' (or poverty trap) described in the passage?",
  "question_type": "multiple_choice",
  "options": [
    "A disincentive structure in targeted welfare where earning incremental earned income causes a sudden loss of state benefits, leaving the recipient financially worse off or no better off.",
    "A geographic region where municipal welfare offices are located on steep coastal terrain.",
    "The complete absence of any social welfare benefits in low-income neighborhoods.",
    "An automatic legal expulsion from public housing upon reaching the age of 65."
  ],
  "correct_answer": "A disincentive structure in targeted welfare where earning incremental earned income causes a sudden loss of state benefits, leaving the recipient financially worse off or no better off.",
  "explanation": "Targeted welfare phases out aggressively as recipients earn money, producing near-100% effective marginal tax rates that trap people in poverty by punishing employment.",
  "points": 1,
  "order_index": 12
},
  {
  "id": "77777777-7777-4777-8777-000000000014",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which ideological argument distinguishes the libertarian defense of UBI (such as Milton Friedman's negative income tax) from the socialist defense of UBI (such as Philippe Van Parijs's 'real freedom for all')?",
  "question_type": "multiple_choice",
  "options": [
    "Libertarians see UBI as an efficient cash vehicle to dismantle the regulatory state and welfare bureaucracy, whereas socialists view UBI as a tool to emancipate workers from capitalist wage labor dependency.",
    "Libertarians advocate paying UBI exclusively in physical gold coins.",
    "Socialists demand that UBI be funded by abolishing all income taxes on corporate executives.",
    "Libertarians insist that children under five receive double payments."
  ],
  "correct_answer": "Libertarians see UBI as an efficient cash vehicle to dismantle the regulatory state and welfare bureaucracy, whereas socialists view UBI as a tool to emancipate workers from capitalist wage labor dependency.",
  "explanation": "Right-libertarians embrace UBI to replace complex government departments with market cash; left-egalitarians see it as giving workers the unconditional power to say 'no' to capital.",
  "points": 1,
  "order_index": 13
},
  {
  "id": "77777777-7777-4777-8777-000000000015",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "How does paying UBI to multi-millionaires satisfy the moral philosophy of 'universality' while remaining fiscally equitable in a progressive tax system?",
  "question_type": "multiple_choice",
  "options": [
    "Universality eliminates bureaucratic means-testing stigma, while high-income earners pay back vastly more than the transfer through progressive income and wealth taxes.",
    "Millionaires are legally mandated to donate their UBI checks to state museums.",
    "Wealthy citizens are disqualified from voting if they cash their UBI check.",
    "The basic income payment depreciates to zero if kept in a commercial bank account."
  ],
  "correct_answer": "Universality eliminates bureaucratic means-testing stigma, while high-income earners pay back vastly more than the transfer through progressive income and wealth taxes.",
  "explanation": "Universality preserves social cohesion and avoids intrusive bureaucracy; progressive tax policy on the revenue side claws back the transfer from the rich.",
  "points": 1,
  "order_index": 14
},
  {
  "id": "77777777-7777-4777-8777-000000000016",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which of the following criticisms represents a 'republican' (civic virtue) objection to Universal Basic Income?",
  "question_type": "multiple_choice",
  "options": [
    "Democracy requires active civic participation and reciprocal cooperative obligations, which might be eroded if citizens become passive recipients of state dividends.",
    "UBI stimulates excessive domestic consumer spending on electronic appliances.",
    "UBI encourages too many citizens to run for parliamentary election.",
    "Cash payments violate the separation of powers between executive and judicial branches."
  ],
  "correct_answer": "Democracy requires active civic participation and reciprocal cooperative obligations, which might be eroded if citizens become passive recipients of state dividends.",
  "explanation": "Civic republicanism stresses duty, reciprocal contribution, and active engagement, worrying that unconditional state stipends transform citizens into atomized, passive consumers.",
  "points": 1,
  "order_index": 15
},
  {
  "id": "77777777-7777-4777-8777-000000000017",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'The contemporary workplace has witnessed the rise of \"bossware\" and algorithmic management. Warehousing logistics workers and remote white-collar professionals alike are subjected to automated tracking: keystroke logging, webcam eye-tracking, and minute-by-minute metric optimization. When an automated algorithm can terminate an employee for falling below a statistical throughput target without human review, the foundational common-law requirement of natural justice and fair disciplinary procedure is compromised. Article 22 of the EU General Data Protection Regulation (GDPR) establishes a presumptive right not to be subject to a decision based solely on automated processing which produces legal effects, yet corporate employers frequently evade this through nominal human rubber-stamping.'\n\nWhat is the primary threat to employment rights posed by automated algorithmic termination?",
  "question_type": "multiple_choice",
  "options": [
    "The elimination of individualized human discretion, context sensitivity, and procedural fairness (natural justice) in disciplinary actions.",
    "Algorithmic servers consuming excessive electrical grid power during office hours.",
    "Employees receiving their dismissal notices via digital email rather than posted paper mail.",
    "The risk that computers will accidentally transfer corporate stock into employee accounts."
  ],
  "correct_answer": "The elimination of individualized human discretion, context sensitivity, and procedural fairness (natural justice) in disciplinary actions.",
  "explanation": "Automated firing treats humans as statistical metrics, stripping away the basic legal right to present mitigating circumstances, explain technical anomalies, or receive a fair hearing.",
  "points": 1,
  "order_index": 16
},
  {
  "id": "77777777-7777-4777-8777-000000000018",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "According to the passage, how do corporate employers circumvent Article 22 of the GDPR regarding automated decision-making?",
  "question_type": "multiple_choice",
  "options": [
    "By having human supervisors perform token 'rubber-stamping' of algorithmically generated termination recommendations without genuine independent evaluation.",
    "By relocating their headquarters to international waters.",
    "By renaming all employee dismissal documents as 'voluntary sabbaticals'.",
    "By deleting employee names from corporate payroll databases."
  ],
  "correct_answer": "By having human supervisors perform token 'rubber-stamping' of algorithmically generated termination recommendations without genuine independent evaluation.",
  "explanation": "To dodge 'solely automated' statutory thresholds, companies introduce a pro forma human sign-off who merely rubber-stamps whatever the algorithm recommended.",
  "points": 1,
  "order_index": 17
},
  {
  "id": "77777777-7777-4777-8777-000000000019",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "In the context of pervasive remote-work keystroke tracking, which human right under the European Convention on Human Rights (ECHR) is most directly engaged?",
  "question_type": "multiple_choice",
  "options": [
    "Article 8: The right to respect for private and family life, home, and correspondence.",
    "Article 3: The prohibition against torture and degrading treatment.",
    "Article 10: Freedom of artistic expression in public parks.",
    "Article 12: The right to enter into civil matrimony."
  ],
  "correct_answer": "Article 8: The right to respect for private and family life, home, and correspondence.",
  "explanation": "ECHR jurisprudence (e.g., Barbulescu v Romania) establishes that employees maintain a legitimate expectation of privacy (Article 8) in digital correspondence and workplace activity.",
  "points": 1,
  "order_index": 18
},
  {
  "id": "77777777-7777-4777-8777-000000000020",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "A corporate HR executive argues: 'Our warehouse monitoring algorithm is completely objective because it measures only physical barcode scan rates and contains no human racial or gender bias.' What unexamined bias does this argument ignore?",
  "question_type": "multiple_choice",
  "options": [
    "Disparate impact bias: applying an identical, unyielding scan speed metric systematically discriminates against pregnant, elderly, or disabled workers with legitimate physiological needs.",
    "The algorithm's source code was written in a non-English programming language.",
    "The company's logo uses colors that trigger optical fatigue.",
    "Barcode scanners emit low-frequency sounds that annoy domestic animals."
  ],
  "correct_answer": "Disparate impact bias: applying an identical, unyielding scan speed metric systematically discriminates against pregnant, elderly, or disabled workers with legitimate physiological needs.",
  "explanation": "Facially neutral metrics can cause severe unlawful indirect discrimination (disparate impact) by penalizing protected groups who cannot match unreasonable physical performance standards.",
  "points": 1,
  "order_index": 19
},
  {
  "id": "77777777-7777-4777-8777-000000000021",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'Economists frequently dismiss fears of technological unemployment by invoking the \"lump of labour fallacy\"—the erroneous assumption that there is a fixed quantity of work to be performed in an economy, such that automating a task permanently extinguishes labor demand. Historically, automation lowered production costs, leading to cheaper goods, increased consumer disposable income, and the creation of entirely new economic industries and professions. Yet, artificial intelligence theorists suggest this historical analogy may falter. Previous automation replaced human muscle with mechanical power, leaving human cognitive capabilities ascendant. If AI successfully substitutes for cognitive and analytical faculties themselves, the human worker may face a structural redundancy akin to the displacement of the horse by the automobile.'\n\nWhat is the core distinction between historical mechanical automation and contemporary AI automation highlighted in the passage?",
  "question_type": "multiple_choice",
  "options": [
    "Past automation mechanized physical labor while shifting humans into cognitive and analytical roles, whereas AI directly automates cognitive and analytical labor itself.",
    "Historical automation only affected agricultural farming, whereas AI only affects manufacturing.",
    "Mechanical machinery did not require electricity, whereas AI requires fossil fuels.",
    "Past automation was funded entirely by government grants, whereas AI is private."
  ],
  "correct_answer": "Past automation mechanized physical labor while shifting humans into cognitive and analytical roles, whereas AI directly automates cognitive and analytical labor itself.",
  "explanation": "The historical escape valve was that displaced physical laborers retrained into knowledge/cognitive work; if cognitive tasks are automated, there may be no higher domain for humans to migrate into.",
  "points": 1,
  "order_index": 20
},
  {
  "id": "77777777-7777-4777-8777-000000000022",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "In the passage, why does the author cite the historical analogy of 'the displacement of the horse by the automobile'?",
  "question_type": "multiple_choice",
  "options": [
    "To illustrate that technology can render a biological factor of production entirely obsolete without creating substitute employment for that entity.",
    "To advocate for the reintroduction of horse-drawn carriages in urban transit.",
    "To demonstrate that horses had union representation under common law.",
    "To praise the automotive industry for reducing greenhouse gas emissions."
  ],
  "correct_answer": "To illustrate that technology can render a biological factor of production entirely obsolete without creating substitute employment for that entity.",
  "explanation": "Horses did not become employed in higher-skilled jobs after cars were invented; their economic utility simply vanished, serving as a cautionary metaphor for human labor.",
  "points": 1,
  "order_index": 21
},
  {
  "id": "77777777-7777-4777-8777-000000000023",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "According to standard economic theory, how does the 'lump of labour fallacy' explain why introducing women into the workforce in the mid-twentieth century did not cause mass male unemployment?",
  "question_type": "multiple_choice",
  "options": [
    "The expansion of the workforce increased aggregate economic production, generated new household demand, and expanded the overall size of the economic pie.",
    "Male workers voluntarily retired at age thirty.",
    "Female workers were prohibited from receiving wages in legal tender.",
    "Governments raised import tariffs on foreign textiles."
  ],
  "correct_answer": "The expansion of the workforce increased aggregate economic production, generated new household demand, and expanded the overall size of the economic pie.",
  "explanation": "Labor supply creates its own demand via consumer spending; the economy is not a zero-sum fixed lump, so adding workers expanded total employment.",
  "points": 1,
  "order_index": 22
},
  {
  "id": "77777777-7777-4777-8777-000000000024",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which of the following interventions represents a Pigouvian policy designed to disincentivize excessive corporate automation at the expense of human employment?",
  "question_type": "multiple_choice",
  "options": [
    "An automated robotics and AI automation tax aimed at leveling the fiscal playing field between capital and human labor.",
    "Subsidizing corporate software purchases with taxpayer revenue.",
    "Banning universities from teaching computer science courses.",
    "Abolishing all safety regulations in manufacturing plants."
  ],
  "correct_answer": "An automated robotics and AI automation tax aimed at leveling the fiscal playing field between capital and human labor.",
  "explanation": "A 'robot tax' internalizes the negative social externalities of rapid displacement, slowing deployment and funding worker retraining or public support.",
  "points": 1,
  "order_index": 23
},
  {
  "id": "77777777-7777-4777-8777-000000000025",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'Generative AI models are trained on colossal corpora of text, images, and music harvested across the public internet without explicit creator consent or licensing compensation. AI developers defend this practice under the American doctrine of \"fair use\" (or text and data mining exceptions in the UK and EU), arguing that training merely extracts unprotectable statistical correlations and abstract stylistic patterns to create transformative new works. Creative artists and authors vigorously contest this, characterizing mass data scraping as systematic copyright theft and digital enclosure. They contend that AI models do not learn like humans, but act as sophisticated commercial derivative machines competing directly in the marketplace against the very human artists whose life works were ingested to build them.'\n\nWhat is the core doctrinal disagreement in the application of 'fair use' to generative AI training?",
  "question_type": "multiple_choice",
  "options": [
    "Whether ingesting copyrighted works to train neural network weights is a transformative non-infringing functional use, or an unauthorized commercial exploitation that impairs the market value of original works.",
    "Whether artists should be legally forced to destroy their physical sketchbooks.",
    "Whether text files uploaded to the internet automatically enter the public domain after 24 hours.",
    "Whether computer software code can be printed on paper."
  ],
  "correct_answer": "Whether ingesting copyrighted works to train neural network weights is a transformative non-infringing functional use, or an unauthorized commercial exploitation that impairs the market value of original works.",
  "explanation": "The central legal conflict pivots on transformative purpose (Factor 1 of fair use) versus market harm and substitution (Factor 4 of fair use).",
  "points": 1,
  "order_index": 24
},
  {
  "id": "77777777-7777-4777-8777-000000000026",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "How does the legal concept of copyright protect human expression while allowing AI companies to scrape factual data?",
  "question_type": "multiple_choice",
  "options": [
    "The 'idea-expression dichotomy' holds that copyright protects original creative expression, but never extends to raw facts, ideas, or functional data patterns.",
    "Copyright only protects works created before the year 1900.",
    "Factual data can only be copyrighted by licensed state universities.",
    "All digital information is classified as physical property under maritime law."
  ],
  "correct_answer": "The 'idea-expression dichotomy' holds that copyright protects original creative expression, but never extends to raw facts, ideas, or functional data patterns.",
  "explanation": "Under the idea-expression dichotomy, anyone can use underlying facts or styles; only the specific creative formulation/expression is shielded by copyright.",
  "points": 1,
  "order_index": 25
},
  {
  "id": "77777777-7777-4777-8777-000000000027",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "In the United States copyright office ruling regarding Zarya of the Dawn (2023), what did the Register of Copyrights decide regarding AI-generated comic book illustrations?",
  "question_type": "multiple_choice",
  "options": [
    "Images generated entirely by Midjourney lacked human authorship and could not receive copyright protection, though the human author's text and selection/arrangement were protected.",
    "All comic books were declared public domain.",
    "Midjourney AI was declared the legal author and owner of the royalties.",
    "The artist was fined for using a computer."
  ],
  "correct_answer": "Images generated entirely by Midjourney lacked human authorship and could not receive copyright protection, though the human author's text and selection/arrangement were protected.",
  "explanation": "Copyright law requires human creative authorship; AI-generated outputs without human brushstroke/creative execution cannot be copyrighted.",
  "points": 1,
  "order_index": 26
},
  {
  "id": "77777777-7777-4777-8777-000000000028",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which collective bargaining solution was successfully negotiated by the Writers Guild of America (WGA) in 2023 regarding AI in screenwriting?",
  "question_type": "multiple_choice",
  "options": [
    "AI cannot write or rewrite literary material, and studios cannot use AI-generated output to undermine writers' credits, residuals, or compensation.",
    "Writers agreed to work without pay in exchange for free subscriptions to ChatGPT.",
    "All television scripts must be written exclusively by artificial intelligence.",
    "Studios were banned from using computers in production offices."
  ],
  "correct_answer": "AI cannot write or rewrite literary material, and studios cannot use AI-generated output to undermine writers' credits, residuals, or compensation.",
  "explanation": "The WGA contract established that AI is not a recognized writer, protecting human credits, residuals, and preventing studios from giving writers cheap AI drafts to edit.",
  "points": 1,
  "order_index": 27
},
  {
  "id": "77777777-7777-4777-8777-000000000029",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'Conventional measures of macroeconomic prosperity, such as Gross Domestic Product (GDP), were formulated in the 1930s by Simon Kuznets. By design, GDP counts only transactions that pass through the cash nexus of the market. Consequently, as feminist economist Marilyn Waring famously demonstrated, an oil tanker spill or a weapon sale immediately boosts GDP through cleanup and manufacturing expenditures, while the immense unpaid labor of domestic caregiving, child-rearing, and eldercare—disproportionately performed by women worldwide—is counted as economically \"zero\". This systemic statistical omission renders the foundational reproductive work that sustains human civilization completely invisible in policy formulation and national resource allocation.'\n\nWhat is the fundamental critique of Gross Domestic Product (GDP) presented in the passage?",
  "question_type": "multiple_choice",
  "options": [
    "GDP measures market cash flow rather than human welfare, perversely counting ecological destruction as positive while ignoring essential unpaid reproductive care work.",
    "GDP figures are calculated using inaccurate Roman numerals.",
    "Simon Kuznets intended GDP to measure only the wealth of military generals.",
    "Market capitalism does not require child-rearing or domestic labor to function."
  ],
  "correct_answer": "GDP measures market cash flow rather than human welfare, perversely counting ecological destruction as positive while ignoring essential unpaid reproductive care work.",
  "explanation": "GDP treats market transactions as output regardless of harm (cleanups, weapons) while completely ignoring non-monetized domestic care work that keeps society functioning.",
  "points": 1,
  "order_index": 28
},
  {
  "id": "77777777-7777-4777-8777-000000000030",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "How does the exclusion of unpaid domestic labor from national accounts directly perpetuate the gender wealth gap throughout women's lifetimes?",
  "question_type": "multiple_choice",
  "options": [
    "Periods spent performing unpaid care work result in disrupted market participation, lower cumulative earnings, and reduced contributory retirement pensions.",
    "Women are legally barred from opening personal bank accounts in OECD nations.",
    "Unpaid caregivers are charged higher municipal residential property taxes.",
    "Corporate employers automatically seize the assets of married female employees."
  ],
  "correct_answer": "Periods spent performing unpaid care work result in disrupted market participation, lower cumulative earnings, and reduced contributory retirement pensions.",
  "explanation": "Taking time out of the workforce for family care limits career progression, wage growth, and contributory state/private pensions, culminating in severe elder poverty.",
  "points": 1,
  "order_index": 29
},
  {
  "id": "77777777-7777-4777-8777-000000000031",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Which public policy reform is most effective at dismantling the gendered division of domestic labor within households?",
  "question_type": "multiple_choice",
  "options": [
    "Non-transferable 'use-it-or-lose-it' paid paternity leave reserved exclusively for fathers.",
    "Increasing the general statutory retirement age to seventy-five for all workers.",
    "Banning household electrical appliances to promote manual cooking.",
    "Replacing all nursery schools with commercial boarding facilities."
  ],
  "correct_answer": "Non-transferable 'use-it-or-lose-it' paid paternity leave reserved exclusively for fathers.",
  "explanation": "Nordic 'daddy quotas' force paternity leave to be taken by fathers rather than transferred to mothers, normalizing male caregiving and reducing maternal career penalties.",
  "points": 1,
  "order_index": 30
},
  {
  "id": "77777777-7777-4777-8777-000000000032",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "In the famous paradox posed by Arthur Cecil Pigou: 'If a man marries his paid housekeeper, national income decreases; if he divorces her and re-hires her as an employee, national income increases.' What does this paradox illustrate?",
  "question_type": "multiple_choice",
  "options": [
    "The arbitrary dependency of national income statistics on the legal and marital form of an activity rather than the physical reality of the work performed.",
    "That marriage should be abolished under commercial tax law.",
    "That domestic housekeepers earn higher hourly wages than corporate attorneys.",
    "That divorce courts have no jurisdiction over domestic employment disputes."
  ],
  "correct_answer": "The arbitrary dependency of national income statistics on the legal and marital form of an activity rather than the physical reality of the work performed.",
  "explanation": "Pigou's riddle highlights that identical domestic cleaning labor is counted in GDP when monetized, but vanishes from GDP when performed within marital relations.",
  "points": 1,
  "order_index": 31
},
  {
  "id": "77777777-7777-4777-8777-000000000033",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'In 1970, Milton Friedman proclaimed in The New York Times that the sole social responsibility of business is to increase its profits within the rules of the game. For decades, this doctrine of \"shareholder primacy\" dominated corporate law in the United States and the UK, prioritizing short-term quarterly earnings, share buybacks, and executive equity bonuses. Opponents champion the \"stakeholder model\" (or codetermination, as practiced in Germany), which legally obligates directors to weigh the interests of employees, customers, suppliers, the environment, and the broader community alongside shareholder returns.'\n\nWhat is the defining feature of the German system of 'codetermination' (Mitbestimmung) in corporate governance?",
  "question_type": "multiple_choice",
  "options": [
    "Employees directly elect half of the members of the supervisory board of large public corporations, giving labor a formal voice in governance.",
    "Trade unions are prohibited from participating in any corporate meetings.",
    "Shareholders are forbidden from selling their shares on public stock exchanges.",
    "All corporate profits must be handed over directly to municipal councils."
  ],
  "correct_answer": "Employees directly elect half of the members of the supervisory board of large public corporations, giving labor a formal voice in governance.",
  "explanation": "Codetermination legally reserves half of supervisory board seats for worker representatives, aligning corporate decisions with long-term labor interests.",
  "points": 1,
  "order_index": 32
},
  {
  "id": "77777777-7777-4777-8777-000000000034",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "How does Section 172 of the UK Companies Act 2006 formulate a director's general statutory duty?",
  "question_type": "multiple_choice",
  "options": [
    "To promote the success of the company for the benefit of its members, while having regard to employee interests, community impact, and the long-term consequences of decisions.",
    "To maximize daily share price above all other considerations.",
    "To donate 50% of annual net revenue to charitable foundations.",
    "To dissolve the company immediately if carbon emissions rise."
  ],
  "correct_answer": "To promote the success of the company for the benefit of its members, while having regard to employee interests, community impact, and the long-term consequences of decisions.",
  "explanation": "Section 172 codifies 'enlightened shareholder value': directors must prioritize company success for shareholders, but must consider employees, environment, and long-term impact.",
  "points": 1,
  "order_index": 33
},
  {
  "id": "77777777-7777-4777-8777-000000000035",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "A corporate hedge fund argues: 'Share buybacks are the most efficient use of surplus corporate capital because they return money to investors who can allocate it elsewhere.' What is the labor and industrial critique of this practice?",
  "question_type": "multiple_choice",
  "options": [
    "Buybacks artificially inflate executive stock-option compensation while diverting capital away from research, productive equipment, and employee wage increases.",
    "Buybacks are classified as treason under maritime law.",
    "Shareholders refuse to accept money returned through stock repurchases.",
    "Buybacks cause automated factory machinery to stop functioning."
  ],
  "correct_answer": "Buybacks artificially inflate executive stock-option compensation while diverting capital away from research, productive equipment, and employee wage increases.",
  "explanation": "Critics highlight that financialized share repurchases cannibalize long-term productive reinvestment in worker wages, innovation, and plant resilience.",
  "points": 1,
  "order_index": 34
},
  {
  "id": "77777777-7777-4777-8777-000000000036",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'The right of organized workers to withdraw their labor through strikes is protected under International Labour Organization (ILO) Convention 87 and recognized as an integral aspect of freedom of association under Article 11 of the ECHR. However, governments frequently seek to curtail strike action in critical infrastructure—such as healthcare, railways, and fire rescue services—by enacting \"minimum service levels\" legislation. When a statute empowers employers to issue \"work notices\" compelling named individual workers to cross picket lines on pain of dismissal, trade unions argue that the constitutional right to strike is rendered illusory.'\n\nWhat is the fundamental legal tension between minimum service level legislation and international labor law?",
  "question_type": "multiple_choice",
  "options": [
    "Balancing the public interest in protecting essential public health and safety against the fundamental human right of workers to associate and engage in effective collective withdrawal of labor.",
    "Determining which color warning flags should be flown outside railway stations during winter.",
    "Whether ambulance drivers should be required to wear military uniforms while off duty.",
    "Deciding whether hospital patients are legally permitted to vote in local council elections."
  ],
  "correct_answer": "Balancing the public interest in protecting essential public health and safety against the fundamental human right of workers to associate and engage in effective collective withdrawal of labor.",
  "explanation": "The core conflict lies between protecting public life and welfare versus gutting workers' only real economic leverage: the collective power to halt labor.",
  "points": 1,
  "order_index": 35
},
  {
  "id": "77777777-7777-4777-8777-000000000037",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Under the jurisprudence of the European Court of Human Rights in Demir and Baykara v Turkey (2008), the right to collective bargaining and strike action is recognized as:",
  "question_type": "multiple_choice",
  "options": [
    "An inherent and essential element of the right to freedom of association under Article 11 of the Convention.",
    "An illegal conspiracy against the public treasury.",
    "A temporary privilege granted at the absolute discretion of the executive monarch.",
    "A commercial antitrust violation under European competition law."
  ],
  "correct_answer": "An inherent and essential element of the right to freedom of association under Article 11 of the Convention.",
  "explanation": "In Demir and Baykara, the ECtHR overturned older precedent to hold that collective bargaining and strike action are integral rights protected under Article 11 ECHR.",
  "points": 1,
  "order_index": 36
},
  {
  "id": "77777777-7777-4777-8777-000000000038",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Why do trade unions argue that issuing mandatory work notices to individual employees during lawful strikes infringes personal liberty?",
  "question_type": "multiple_choice",
  "options": [
    "Compelling an individual to perform labor under threat of summary dismissal approaches the character of forced labor under Article 4 of the ECHR.",
    "It requires workers to commute by public buses.",
    "Workers who receive letters are prohibited from watching television.",
    "Dismissed workers are denied access to public libraries."
  ],
  "correct_answer": "Compelling an individual to perform labor under threat of summary dismissal approaches the character of forced labor under Article 4 of the ECHR.",
  "explanation": "Unions argue that conscripting specific employees to work against their will under pain of immediate firing undermines basic bodily and employment liberty.",
  "points": 1,
  "order_index": 37
},
  {
  "id": "77777777-7777-4777-8777-000000000039",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'In Lungowe v Vedanta Resources plc (2019), the UK Supreme Court addressed whether a British multinational parent company could be held liable in negligence for environmental damage and human rights violations committed by its foreign subsidiary in Zambia. Overturning decades of corporate shield defenses, the Supreme Court ruled that a parent company owes a direct common-law duty of care to communities affected by its overseas operations if it exercises systemic managerial control, supervises subsidiary environmental policies, or publicly holds itself out as responsible for group-wide standards.'\n\nWhat was the profound doctrinal significance of Vedanta for corporate parent liability?",
  "question_type": "multiple_choice",
  "options": [
    "It established that parent corporations cannot automatically hide behind the separate legal personality of overseas subsidiaries if they actively direct or oversee operational policies.",
    "It ruled that British courts have no jurisdiction outside the British Isles.",
    "It declared all foreign mining operations illegal under English common law.",
    "It mandated that all foreign subsidiaries merge into a single global entity."
  ],
  "correct_answer": "It established that parent corporations cannot automatically hide behind the separate legal personality of overseas subsidiaries if they actively direct or oversee operational policies.",
  "explanation": "Vedanta breached the corporate veil via common-law tort: parent companies that control or publicize governance over subsidiaries owe a direct duty of care to affected foreign victims.",
  "points": 1,
  "order_index": 38
},
  {
  "id": "77777777-7777-4777-8777-000000000040",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Under the European Union Corporate Sustainability Due Diligence Directive (CSDDD), what legal duty is imposed on large multinational corporations?",
  "question_type": "multiple_choice",
  "options": [
    "To conduct mandatory human rights and environmental due diligence across their entire upstream and downstream global supply chains and mitigate identified harms.",
    "To cease importing all raw materials from non-European countries.",
    "To pay all foreign workers in European Union currency.",
    "To submit their annual budgets to the United Nations Security Council."
  ],
  "correct_answer": "To conduct mandatory human rights and environmental due diligence across their entire upstream and downstream global supply chains and mitigate identified harms.",
  "explanation": "The CSDDD transforms corporate social responsibility into hard law, requiring companies to identify, prevent, and remediate human rights and environmental abuses in their value chains.",
  "points": 1,
  "order_index": 39
},
  {
  "id": "77777777-7777-4777-8777-000000000041",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "Passage Excerpt: 'In Capital in the Twenty-First Century, Thomas Piketty demonstrated that whenever the net rate of return on capital (r) systematically exceeds the overall economic growth rate (g), inherited wealth grows faster than output and wages. Under the formula r > g, meritocracy dissolves as patrimonial capitalism re-emerges: an individual's economic destiny is dictated far more by inherited familial assets than by lifelong labor, education, or effort. To prevent dangerous oligarchic wealth concentration, economists propose progressive annual net wealth taxes and aggressive inheritance estate duties.'\n\nWhat is the sociological consequence of the inequality condition r > g as formulated by Piketty?",
  "question_type": "multiple_choice",
  "options": [
    "Society regresses toward patrimonial capitalism, where inherited generational wealth eclipses labor income and undermines meritocratic social mobility.",
    "Economic growth accelerates to unprecedented historical speeds.",
    "All private financial capital converts into public infrastructure.",
    "Interest rates set by central banks plummet to permanent negative values."
  ],
  "correct_answer": "Society regresses toward patrimonial capitalism, where inherited generational wealth eclipses labor income and undermines meritocratic social mobility.",
  "explanation": "When capital returns outpace wage growth ($r > g$), old fortunes accumulate automatically, making inheritance vastly more determinative of wealth than lifetime hard work.",
  "points": 1,
  "order_index": 40
},
  {
  "id": "77777777-7777-4777-8777-000000000042",
  "test_id": "77777777-7777-4777-8777-777777777777",
  "question_text": "A conservative philosopher argues against inheritance taxation: 'Parents have a natural moral right to pass their accumulated wealth to their children, and taxing bequests violates family autonomy.' What is the egalitarian philosophical response to this argument?",
  "question_type": "multiple_choice",
  "options": [
    "Unregulated intergenerational wealth transmission creates vast unearned advantages at birth, directly subverting the foundational liberal principle of fair equality of opportunity.",
    "Children should be declared legal property of the state at age eighteen.",
    "Inherited money always loses its legal purchasing power after forty years.",
    "Family relationships should be prohibited under civil equality statutes."
  ],
  "correct_answer": "Unregulated intergenerational wealth transmission creates vast unearned advantages at birth, directly subverting the foundational liberal principle of fair equality of opportunity.",
  "explanation": "True equality of opportunity (John Rawls) cannot exist when some children inherit astronomical fortunes while others start with nothing through no fault of their own.",
  "points": 1,
  "order_index": 41
}
];

async function seed() {
  console.log('Upserting 5 LNAT Tests with 42 questions each...');
  const { error: testErr } = await supabase.from('tests').upsert(LNAT_TESTS);
  if (testErr) {
    console.error('Error inserting tests:', testErr);
  } else {
    console.log('Tests successfully seeded!');
  }

  console.log(`Upserting ${LNAT_QUESTIONS.length} Questions in batches...`);
  const chunkSize = 20;
  for (let i = 0; i < LNAT_QUESTIONS.length; i += chunkSize) {
    const chunk = LNAT_QUESTIONS.slice(i, i + chunkSize);
    const { error: qErr } = await supabase.from('questions').upsert(chunk);
    if (qErr) {
      console.error(`Error inserting questions batch ${i} - ${i + chunk.length}:`, qErr);
    } else {
      console.log(`Inserted batch ${i + 1} - ${Math.min(i + chunkSize, LNAT_QUESTIONS.length)} / ${LNAT_QUESTIONS.length}`);
    }
  }
  console.log('Seeding finished!');
}

if (process.argv[1] && (process.argv[1].endsWith('seed_lnat.mjs') || process.argv[1].includes('seed_lnat'))) {
  seed();
}
