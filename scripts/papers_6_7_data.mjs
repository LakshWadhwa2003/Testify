// Paper 6 and Paper 7 definition and seed pipeline

export const PAPER_6_TEST = {
  id: "66666666-6666-4666-8666-666666666666",
  title: "LNAT Paper 6: Cognitive Psychology, Eyewitness Memory & Judicial Proof",
  description: "Adapted from official LNAT Practice Test 2 (Passage 3: On Memory by Michel de Montaigne) and legal epistemology. Explores the fallibility of human memory, eyewitness identification reliability, presumption of innocence, cognitive bias in forensic testimony, and standards of proof in common-law criminal jurisprudence.",
  duration_minutes: 95,
  total_points: 42,
  is_published: true,
  category: "LNAT - Critical Reasoning"
};

export const PAPER_7_TEST = {
  id: "77777777-7777-4777-8777-777777777777",
  title: "LNAT Paper 7: Automation, The Future of Work & Socio-Economic Rights",
  description: "Derived from official LNAT Practice Test 2 (Passage 6: 'The Future of Work') and Practice Test 1 ('A Global Dilemma'). Investigates technological unemployment, gig-economy employment status, collective bargaining, universal basic income, algorithmic management, and socio-economic rights in modern jurisprudence.",
  duration_minutes: 95,
  total_points: 42,
  is_published: true,
  category: "LNAT - Critical Reasoning"
};

export const PAPER_6_QUESTIONS = [
  // --- Passage 1: Montaigne on Memory (Adapted from official LNAT Practice Test 2, Passage 3) ---
  {
    id: "66666666-6666-4666-8666-000000000001",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'There is no man so unsuited to the task of speaking about memory as I am, for I find scarcely a trace of it in myself, and I do not think there is another man in the world so deficient. People commonly mistake memory for judgment, but experience reveals that men blessed with excellent memories often suffer from remarkably feeble judgment. If my memory had been good, I should have deafened all my friends with my chatter, for the storehouse of memory is generally better stocked than that of invention. Furthermore, my infirmity shields me from ambition, for lack of memory is an intolerable defect in anyone who takes on the burden of the world's affairs.'\n\nIn the opening sentence of the excerpt, which rhetorical device does the author primarily employ?",
    question_type: "multiple_choice",
    options: [
      "Dramatic hyperbole designed to cultivate an air of philosophical modesty.",
      "An empirical syllogism supported by psychometric clinical observation.",
      "An uncritical appeal to external philosophical authorities such as Plato.",
      "A deductive proof demonstrating the impossibility of autobiographical writing."
    ],
    correct_answer: "Dramatic hyperbole designed to cultivate an air of philosophical modesty.",
    explanation: "Montaigne exaggerates his lack of memory ('scarcely a trace', 'no another man in the world so deficient') to humorously introduce his reflections from a position of modesty.",
    points: 1,
    order_index: 0
  },
  {
    id: "66666666-6666-4666-8666-000000000002",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "According to Montaigne's argument, why does having an exceptional memory pose a potential communicative liability?",
    question_type: "multiple_choice",
    options: [
      "It causes speakers to confuse imaginative speculation with verifiable factual truth.",
      "It tempts individuals to bore companions by regurgitating an excess of recollected facts rather than engaging in concise, inventive conversation.",
      "It makes individuals intellectually incapable of mastering judicial rhetoric.",
      "It renders them vulnerable to psychological manipulation during cross-examination."
    ],
    correct_answer: "It tempts individuals to bore companions by regurgitating an excess of recollected facts rather than engaging in concise, inventive conversation.",
    explanation: "Montaigne observes that without a poor memory he would have 'deafened all my friends with my chatter', since the storehouse of memory supplies endless material compared to spontaneous invention.",
    points: 1,
    order_index: 1
  },
  {
    id: "66666666-6666-4666-8666-000000000003",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Which of the following propositions best reflects the fundamental philosophical distinction Montaigne draws between 'memory' and 'judgment'?",
    question_type: "multiple_choice",
    options: [
      "Memory is an innate cognitive faculty, whereas judgment is entirely an artificial cultural construct.",
      "Memory merely stores and reproduces received data, whereas judgment involves the critical discernment and evaluation of meaning.",
      "Judgment is morally inferior to memory because it requires emotional detachment.",
      "Those who lack memory inevitably develop superior political instincts for statecraft."
    ],
    correct_answer: "Memory merely stores and reproduces received data, whereas judgment involves the critical discernment and evaluation of meaning.",
    explanation: "Montaigne separates the rote capacity to retain information (memory) from the intellectual power to weigh, analyze, and make wise decisions (judgment).",
    points: 1,
    order_index: 2
  },
  {
    id: "66666666-6666-4666-8666-000000000004",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Which of the following, if true, would most seriously weaken Montaigne's contention that poor memory protects an individual from political ambition?",
    question_type: "multiple_choice",
    options: [
      "Many highly successful political leaders rely primarily on competent secretarial staff and written archives rather than unassisted biological recall.",
      "Philosophers frequently disagree about the neurological seat of mnemonic faculties.",
      "Ancient rhetoricians placed high value on the 'method of loci' for memorizing speeches.",
      "Some individuals with exceptional memories also exhibit strong mathematical aptitude."
    ],
    correct_answer: "Many highly successful political leaders rely primarily on competent secretarial staff and written archives rather than unassisted biological recall.",
    explanation: "If leaders can outsource memory to institutional aides and records, a personal deficiency in memory ceases to be an 'intolerable defect' blocking political ambition.",
    points: 1,
    order_index: 3
  },

  // --- Passage 2: Elizabeth Loftus & The Reconstructive Nature of Memory ---
  {
    id: "66666666-6666-4666-8666-000000000005",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'Human memory does not function like a video recording that passively captures reality to be played back with fidelity. Rather, as Elizabeth Loftus demonstrated in her landmark 1974 experiments, memory is fundamentally reconstructive. When subjects viewed a film of a car collision, those asked how fast the vehicles were moving when they \"smashed\" into each other estimated significantly higher speeds than those asked when they \"hit\" each other. A week later, subjects in the \"smashed\" cohort were far more likely to falsely recall seeing broken glass at the scene, despite no broken glass existing in the film.'\n\nWhat is the central implication of Loftus's findings for the legal concept of eyewitness testimony?",
    question_type: "multiple_choice",
    options: [
      "Witnesses who describe high speeds are invariably committing deliberate perjury in court.",
      "Post-event suggestions and questioning terminology can invisibly alter a witness's genuine recollection of factual occurrences.",
      "Automobile collisions cannot be adjudicated without telemetry sensor data.",
      "Physical evidence is inherently more prone to subjective contamination than oral testimony."
    ],
    correct_answer: "Post-event suggestions and questioning terminology can invisibly alter a witness's genuine recollection of factual occurrences.",
    explanation: "Loftus's work proves the 'misinformation effect': leading phrasing does not just alter immediate verbal answers, but integrates into and corrupts the underlying memory.",
    points: 1,
    order_index: 4
  },
  {
    id: "66666666-6666-4666-8666-000000000006",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Based on the passage, the false recollection of broken glass illustrates that:",
    question_type: "multiple_choice",
    options: [
      "Semantic associations of violent impact can overwrite sensory perceptual memory with congruent imagined details.",
      "Human visual perception is systematically blinded by bright kinetic motion.",
      "Experimental subjects always seek to appease academic researchers.",
      "Memory retention deteriorates linearly after precisely seven days."
    ],
    correct_answer: "Semantic associations of violent impact can overwrite sensory perceptual memory with congruent imagined details.",
    explanation: "The verb 'smashed' triggered schema-driven expectations of severe destruction (broken glass), which the brain integrated into the reconstructed episodic memory.",
    points: 1,
    order_index: 5
  },
  {
    id: "66666666-6666-4666-8666-000000000007",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Which of the following courtroom practices is most directly justified by Loftus's findings on reconstructive memory?",
    question_type: "multiple_choice",
    options: [
      "The evidentiary prohibition against asking leading questions during direct examination.",
      "The elimination of peremptory challenges during jury selection.",
      "The mandatory imposition of minimum custodial sentences for road traffic offenses.",
      "The introduction of lie detector polygraphs into formal trial proceedings."
    ],
    correct_answer: "The evidentiary prohibition against asking leading questions during direct examination.",
    explanation: "Leading questions suggest the desired answer to the witness, risking the subconscious contamination and reconstruction of their testimony.",
    points: 1,
    order_index: 6
  },
  {
    id: "66666666-6666-4666-8666-000000000008",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "A prosecutor argues: 'The eyewitness has expressed absolute certainty that the defendant was the gunman; therefore, any possibility of misidentification is eliminated.' Which logical fallacy does this argument commit in light of psychological research on memory?",
    question_type: "multiple_choice",
    options: [
      "Equating subjective subjective confidence with objective historical accuracy.",
      "Committing an ad hominem attack against defense counsel.",
      "Assuming that absence of physical evidence proves innocence.",
      "Confusing statutory necessity with discretionary executive power."
    ],
    correct_answer: "Equating subjective subjective confidence with objective historical accuracy.",
    explanation: "Empirical studies consistently show a weak correlation between witness certainty and actual identification accuracy, particularly after repeated police questioning.",
    points: 1,
    order_index: 7
  },

  // --- Passage 3: The Turnbull Guidelines and Identification Evidence ---
  {
    id: "66666666-6666-4666-8666-000000000009",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'In R v Turnbull (1977), the English Court of Appeal established mandatory judicial directions where the prosecution's case relies substantially on contested identification evidence. The trial judge must warn the jury of the special need for caution, emphasizing that an honest and convincing witness may nonetheless be mistaken. The judge must assess the quality of the observation—analyzing factors such as the duration of the sighting, distance, lighting conditions, whether the observation was impeded, whether the witness had previously known the accused, and the interval between the event and the formal identification.'\n\nWhat was the primary policy motivation underlying the Court of Appeal's ruling in R v Turnbull?",
    question_type: "multiple_choice",
    options: [
      "To abolish the use of uncorroborated eyewitness identifications in all criminal trials.",
      "To mitigate the chronic systemic risk of wrongful convictions stemming from sincere but mistaken eyewitness testimony.",
      "To expedite judicial proceedings by restricting the length of defense cross-examinations.",
      "To transfer the ultimate burden of evaluating guilt from the jury to the presiding judge."
    ],
    correct_answer: "To mitigate the chronic systemic risk of wrongful convictions stemming from sincere but mistaken eyewitness testimony.",
    explanation: "The Turnbull guidelines were formulated following high-profile miscarriages of justice (such as Beck and Dougherty) where confident, honest witnesses had identified innocent people.",
    points: 1,
    order_index: 8
  },
  {
    id: "66666666-6666-4666-8666-000000000010",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Under the Turnbull doctrine, when the quality of the identification is deemed exceptionally poor (e.g., a fleeting glimpse in darkness) and lacks supporting corroborative evidence, what action should the trial judge take?",
    question_type: "multiple_choice",
    options: [
      "Withdraw the case from the jury and direct an acquittal.",
      "Adjourn the trial indefinitely until DNA evidence can be obtained.",
      "Compel the defendant to testify under oath to clarify their whereabouts.",
      "Permit the jury to convict provided they reach an absolute unanimous verdict."
    ],
    correct_answer: "Withdraw the case from the jury and direct an acquittal.",
    explanation: "Turnbull explicitly rules that where the identification is poor and unsupported by other evidence, the judge must withdraw the case to prevent an unsafe verdict.",
    points: 1,
    order_index: 9
  },
  {
    id: "66666666-6666-4666-8666-000000000011",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Which of the following factors from the Turnbull guidelines accounts for the psychological phenomenon of 'memory decay'?",
    question_type: "multiple_choice",
    options: [
      "The duration of the initial visual observation.",
      "The lighting conditions at the locus of the crime.",
      "The time interval elapsed between the event and the formal identification procedure.",
      "Whether the perpetrator possessed unusual facial features."
    ],
    correct_answer: "The time interval elapsed between the event and the formal identification procedure.",
    explanation: "The delay between the witnessed incident and the police lineup directly correlates with decay and potential external interference in the witness's mental representation.",
    points: 1,
    order_index: 10
  },
  {
    id: "66666666-6666-4666-8666-000000000012",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "A critic of sequential photo lineups argues: 'Simultaneous lineups allow witnesses to compare faces directly, which feels more natural to human intuition.' What is the cognitive rebuttal to this argument?",
    question_type: "multiple_choice",
    options: [
      "Simultaneous presentation encourages 'relative judgment' (picking the face that looks most like the culprit relative to the others), increasing false positive identifications.",
      "Sequential lineups require digital computer monitors that are vulnerable to electrical failures.",
      "Direct facial comparison is prohibited by international human rights conventions.",
      "Human faces cannot be perceived when viewed in isolation from body silhouettes."
    ],
    correct_answer: "Simultaneous presentation encourages 'relative judgment' (picking the face that looks most like the culprit relative to the others), increasing false positive identifications.",
    explanation: "In simultaneous lineups, witnesses compare suspects to each other (relative judgment), whereas sequential lineups force an absolute judgment comparing each photo to their memory.",
    points: 1,
    order_index: 11
  },

  // --- Passage 4: Forensic Science Fallibility & Cognitive Bias ---
  {
    id: "66666666-6666-4666-8666-000000000013",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'The 2009 National Academy of Sciences (NAS) report delivered a devastating appraisal of forensic disciplines long revered in trial courts. With the sole exception of nuclear DNA analysis, no forensic method—including latent fingerprint comparison, microscopic hair examination, bite-mark identification, or tool-mark matching—has been rigorously validated to establish individualization. Furthermore, forensic examiners are routinely subjected to cognitive contextual bias. When fingerprint analysts were presented with pairs of prints they had previously declared a \"match\", but were now told that the suspect had an ironclad alibi, a significant proportion reversed their original determinations.'\n\nWhat does the contextual bias experiment described in the passage demonstrate about forensic fingerprint analysis?",
    question_type: "multiple_choice",
    options: [
      "Fingerprint ridges change shape over time due to atmospheric oxidation.",
      "Visual pattern interpretation in forensic analysis is subjective and can be swayed by non-pertinent extraneous case information.",
      "Nuclear DNA analysis is equally susceptible to optical distortion.",
      "All forensic scientists intentionally falsify evidence to assist prosecution teams."
    ],
    correct_answer: "Visual pattern interpretation in forensic analysis is subjective and can be swayed by non-pertinent extraneous case information.",
    explanation: "The experiment proved that the subjective perceptual threshold of what constitutes a 'match' shifts when examiners are influenced by extraneous investigative context.",
    points: 1,
    order_index: 12
  },
  {
    id: "66666666-6666-4666-8666-000000000014",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "According to the NAS report cited, what fundamentally separates nuclear DNA analysis from disciplines like bite-mark or microscopic hair analysis?",
    question_type: "multiple_choice",
    options: [
      "Nuclear DNA has a validated population genetics database and quantifiable, scientifically tested error rates.",
      "DNA samples never degrade under ambient environmental exposure.",
      "Bite-mark analysis is exclusively practiced by certified medical coroners.",
      "DNA matching does not require specialized laboratory equipment."
    ],
    correct_answer: "Nuclear DNA has a validated population genetics database and quantifiable, scientifically tested error rates.",
    explanation: "DNA profiling rests on rigorous molecular biology and statistical population genetics with known random match probabilities, unlike pattern-matching disciplines.",
    points: 1,
    order_index: 13
  },
  {
    id: "66666666-6666-4666-8666-000000000015",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Which practical reform in forensic laboratories would most effectively counteract the contextual bias revealed in the passage?",
    question_type: "multiple_choice",
    options: [
      "Linear Sequential Unmasking (LSU), where analysts must fully document the latent evidence before seeing any suspect reference print or contextual case details.",
      "Allowing police detectives to directly oversee forensic technicians during microscope examinations.",
      "Replacing jury trials with bench trials whenever forensic evidence is introduced.",
      "Prohibiting defense experts from conducting independent tests on physical evidence."
    ],
    correct_answer: "Linear Sequential Unmasking (LSU), where analysts must fully document the latent evidence before seeing any suspect reference print or contextual case details.",
    explanation: "LSU ensures examiners analyze and characterize evidence 'blindly' before exposure to biasing suspect information or external investigative narratives.",
    points: 1,
    order_index: 14
  },
  {
    id: "66666666-6666-4666-8666-000000000016",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "An expert witness testifies: 'The probability of two people sharing this exact microscopic hair profile is zero.' Which critical assertion does this statement unjustifiably make?",
    question_type: "multiple_choice",
    options: [
      "An unverified claim of unique individualization unsupported by empirical population frequency data.",
      "A concession that the defendant was not present at the crime scene.",
      "A violation of the statutory hearsay exclusion rule.",
      "An admission that the microscopic instrument was miscalibrated."
    ],
    correct_answer: "An unverified claim of unique individualization unsupported by empirical population frequency data.",
    explanation: "Microscopic hair examination has no scientific baseline for calculating population rarity; asserting a zero match probability is scientifically ungrounded hyperbole.",
    points: 1,
    order_index: 15
  },

  // --- Passage 5: Blackstone's Ratio & The Epistemic Asymmetry of Proof ---
  {
    id: "66666666-6666-4666-8666-000000000017",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'In his 1765 Commentaries on the Laws of England, Sir William Blackstone famously declared: \"It is better that ten guilty persons escape, than that one innocent suffer.\" This maxim embodies the normative cornerstone of Anglo-American criminal law: an intentional structural asymmetry designed to minimize Type I errors (false convictions) even at the cost of tolerating Type II errors (false acquittals). Utilitarian critics, however, challenge the proportionality of the ratio. If an escaped violent offender commits multiple subsequent murders, does the aggregate suffering inflicted upon innocent victims not surpass the injustice of a single wrongful conviction?'\n\nWhat is the core normative premise underlying Blackstone's ratio?",
    question_type: "multiple_choice",
    options: [
      "The moral culpability of an individual offender decreases over time.",
      "State-sponsored punishment of an innocent person constitutes a qualitatively graver systemic injustice than the failure of the state to punish a private criminal.",
      "Guilty individuals will inevitably be brought to justice through natural or spiritual retribution.",
      "The financial expense of housing inmates exceeds the social cost of unsolved crimes."
    ],
    correct_answer: "State-sponsored punishment of an innocent person constitutes a qualitatively graver systemic injustice than the failure of the state to punish a private criminal.",
    explanation: "Blackstone's principle holds that when the state—with its monopoly on violence and moral authority—punishes an innocent, it subverts the foundational legitimacy of the legal order.",
    points: 1,
    order_index: 16
  },
  {
    id: "66666666-6666-4666-8666-000000000018",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "In the terminology of statistical hypothesis testing, how does criminal jurisprudence classify a wrongful conviction?",
    question_type: "multiple_choice",
    options: [
      "A Type I error (rejecting the null hypothesis of innocence when it is in fact true).",
      "A Type II error (failing to reject the null hypothesis of innocence when the defendant is guilty).",
      "A sampling bias error caused by non-random jury selection.",
      "A regression to the mean in forensic probability calculation."
    ],
    correct_answer: "A Type I error (rejecting the null hypothesis of innocence when it is in fact true).",
    explanation: "Because the legal presumption starts with innocence as the null hypothesis, convicting an innocent person is a false positive, or Type I error.",
    points: 1,
    order_index: 17
  },
  {
    id: "66666666-6666-4666-8666-000000000019",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "How would a consistent consequentialist utilitarian assess Blackstone's ratio?",
    question_type: "multiple_choice",
    options: [
      "Reject any fixed numerical ratio in favor of an empirical calculation maximizing aggregate social utility and crime deterrence.",
      "Demand that all criminal trials be resolved under the civil 'balance of probabilities' standard.",
      "Insist that capital punishment be abolished universally regardless of deterrence data.",
      "Argue that victim satisfaction should be the exclusive determinant of sentencing length."
    ],
    correct_answer: "Reject any fixed numerical ratio in favor of an empirical calculation maximizing aggregate social utility and crime deterrence.",
    explanation: "Utilitarianism evaluates policies by their overall consequences; if letting ten violent felons free produces far more net misery than one wrongful imprisonment, utilitarians would revise the ratio.",
    points: 1,
    order_index: 18
  },
  {
    id: "66666666-6666-4666-8666-000000000020",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Which legal mechanism directly Operationalizes the normative prioritization expressed in Blackstone's ratio within modern common-law courtrooms?",
    question_type: "multiple_choice",
    options: [
      "The requirement that the prosecution establish criminal guilt 'beyond reasonable doubt'.",
      "The discretion of prosecutors to enter a nolle prosequi.",
      "The statutory limit on jury trial durations in magistrate courts.",
      "The doctrine of precedent (stare decisis) in appellate rulings."
    ],
    correct_answer: "The requirement that the prosecution establish criminal guilt 'beyond reasonable doubt'.",
    explanation: "The heightened burden of proof ('beyond reasonable doubt') creates an evidentiary barrier intentionally calibrated to avoid convicting the innocent.",
    points: 1,
    order_index: 19
  },

  // --- Passage 6: Neuroimaging & The Privilege Against Self-Incrimination ---
  {
    id: "66666666-6666-4666-8666-000000000021",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'Advancements in functional Magnetic Resonance Imaging (fMRI) have fueled claims by commercial neuro-technology firms that neural blood-oxygenation patterns can definitively reveal whether a subject is lying or recognizing a crime scene. Legal scholars, however, observe that compelled fMRI scans threaten to rupture the boundary between physical evidence (such as blood samples or fingerprints, which can be lawfully compelled) and testimonial evidence (communications from an accused's mental cognition, protected by the privilege against self-incrimination). When a machine directly decodes propositional knowledge stored within the brain, the boundary between an object to be inspected and a witness testifying against oneself collapses.'\n\nWhat is the central constitutional tension identified in the passage regarding compelled neuroimaging?",
    question_type: "multiple_choice",
    options: [
      "Whether neural hemodynamic responses should be categorized as non-testimonial physical attributes or as protected cognitive testimony.",
      "Whether the high monetary cost of MRI machines violates judicial budget caps.",
      "Whether radiologists possess statutory immunity from civil malpractice claims.",
      "Whether MRI magnetic fields disrupt electronic court reporting devices."
    ],
    correct_answer: "Whether neural hemodynamic responses should be categorized as non-testimonial physical attributes or as protected cognitive testimony.",
    explanation: "Self-incrimination doctrine protects the contents of a suspect's mind (testimony), but allows taking bodily samples (physical evidence); fMRI extracts mental content via physical brain scans.",
    points: 1,
    order_index: 20
  },
  {
    id: "66666666-6666-4666-8666-000000000022",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Under the Daubert standard for scientific evidence, which of the following poses the most formidable barrier to the admissibility of fMRI lie detection?",
    question_type: "multiple_choice",
    options: [
      "The lack of general scientific acceptance within the cognitive neuroscience community and unproven ecological validity outside laboratory settings.",
      "The requirement that all trial evidence be legible in printed textual format.",
      "The rule that only licensed police officers may operate trial technology.",
      "The constitutional prohibition against using electricity inside courtroom chambers."
    ],
    correct_answer: "The lack of general scientific acceptance within the cognitive neuroscience community and unproven ecological validity outside laboratory settings.",
    explanation: "Daubert requires peer review, general acceptance, and known error rates in real-world conditions; lab-based fMRI deception tasks have not been validated for high-stakes real crimes.",
    points: 1,
    order_index: 21
  },
  {
    id: "66666666-6666-4666-8666-000000000023",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "If a subject displays neural recognition upon viewing a murder weapon during a 'brain fingerprinting' test, which plausible alternative explanation undermines the inference that they are the killer?",
    question_type: "multiple_choice",
    options: [
      "The subject may have viewed identical weapons in media coverage or possessed a similar tool innocently.",
      "The human brain ceases generating electric potentials when confronted with violent stimuli.",
      "fMRI detectors cannot function if a subject blinks their eyes.",
      "Blood oxygen levels always plummet uniformly across the prefrontal cortex during stress."
    ],
    correct_answer: "The subject may have viewed identical weapons in media coverage or possessed a similar tool innocently.",
    explanation: "Brain-wave or fMRI recognition reveals only familiarity with the image, not the moral or episodic context in which the familiarity was acquired.",
    points: 1,
    order_index: 22
  },

  // --- Passage 7: The M'Naghten Rules & Criminal Responsibility ---
  {
    id: "66666666-6666-4666-8666-000000000024",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'Formulated following the 1843 trial of Daniel M'Naghten, the English insanity defense rules require establishing that at the time of committing the act, the accused labored under such a defect of reason, from disease of the mind, as not to know the nature and quality of the act he was doing; or, if he did know it, that he did not know he was doing what was wrong. Critics have long argued that this cognitive test ignores volitional and emotional defects: an individual suffering from paranoid psychosis may be fully aware that killing is prohibited by law, yet remain utterly powerless to resist an irresistible command hallucination.'\n\nWhat is the fundamental limitation of the M'Naghten test highlighted by modern psychiatric jurisprudence?",
    question_type: "multiple_choice",
    options: [
      "It focuses strictly on cognitive comprehension while failing to accommodate volitional impairment or loss of behavioral self-control.",
      "It requires defendants to possess a formal medical university degree.",
      "It applies solely to offenses committed against members of the royal family.",
      "It automatically exonerates anyone who experiences temporary depression."
    ],
    correct_answer: "It focuses strictly on cognitive comprehension while failing to accommodate volitional impairment or loss of behavioral self-control.",
    explanation: "M'Naghten hinges purely on intellectual knowing ('did he know the nature/wrongness of the act?'), excluding individuals whose severe illness destroys their ability to control their actions.",
    points: 1,
    order_index: 23
  },
  {
    id: "66666666-6666-4666-8666-000000000025",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "In R v Windle (1952), the defendant administered an overdose to his terminally ill wife and remarked to police: 'I suppose they will hang me for this.' Why did the court reject his insanity defense under M'Naghten?",
    question_type: "multiple_choice",
    options: [
      "His statement demonstrated that he understood the act was contrary to positive criminal law, satisfying the cognitive test of knowing it was 'wrong'.",
      "Terminally ill victims are excluded from homicide statutes.",
      "The defendant failed to pay the required court filing fees.",
      "His alibi was contradicted by multiple independent witnesses."
    ],
    correct_answer: "His statement demonstrated that he understood the act was contrary to positive criminal law, satisfying the cognitive test of knowing it was 'wrong'.",
    explanation: "In English law, 'wrong' in M'Naghten means legally wrong; Windle's statement showed he knew the law forbade his act, barring the insanity defense despite his severe mental illness.",
    points: 1,
    order_index: 24
  },
  {
    id: "66666666-6666-4666-8666-000000000026",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "How does the doctrine of 'diminished responsibility' under the Homicide Act 1957 modify the rigid binary of the M'Naghten rules in murder cases?",
    question_type: "multiple_choice",
    options: [
      "It provides a partial defense that reduces a murder conviction to voluntary manslaughter, recognizing substantial impairment without requiring total cognitive blindness.",
      "It mandates immediate unconditional release for all psychotic defendants.",
      "It shifts the burden of proof onto the trial judge rather than the jury.",
      "It eliminates the necessity of proving the actus reus of the crime."
    ],
    correct_answer: "It provides a partial defense that reduces a murder conviction to voluntary manslaughter, recognizing substantial impairment without requiring total cognitive blindness.",
    explanation: "Diminished responsibility acts as a compassionate middle ground, avoiding the mandatory life sentence for murder when a recognized condition substantially impairs mental functioning.",
    points: 1,
    order_index: 25
  },

  // --- Passage 8: The Reid Technique & The Psychology of False Confessions ---
  {
    id: "66666666-6666-4666-8666-000000000027",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'The Reid Technique of police interrogation relies on a nine-step process combining psychological maximization and minimization. Interrogators confront the suspect with unyielding assertions of guilt, reject all denials, and fabricate fictitious evidence (such as asserting that a co-conspirator has already confessed). Concurrently, they offer moral rationalizations and minimize the culpability of the offense, subtly implying that cooperation will yield leniency. While effective at extracting admissions, Innocence Project data reveals that nearly 30% of DNA-exonerated individuals had initially falsely confessed to serious violent crimes under coercive psychological interrogation.'\n\nWhich psychological mechanism best explains why an innocent person would falsely confess to a crime they did not commit during a Reid-style interrogation?",
    question_type: "multiple_choice",
    options: [
      "Temporal discounting: the acute, immediate desire to escape unrelenting psychological interrogation distress outweighs perceived future risks of legal punishment.",
      "A sudden biological onset of retrograde amnesia induced by room lighting.",
      "An altruistic desire to receive fame through notorious criminal publicity.",
      "A complete loss of phonetic comprehension of legal language."
    ],
    correct_answer: "Temporal discounting: the acute, immediate desire to escape unrelenting psychological interrogation distress outweighs perceived future risks of legal punishment.",
    explanation: "Exhausted suspects experience intense stress and short-sightedness; falsely confessing appears to be the only available exit from an agonizing immediate ordeal.",
    points: 1,
    order_index: 26
  },
  {
    id: "66666666-6666-4666-8666-000000000028",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "In the United Kingdom, the Police and Criminal Evidence Act 1984 (PACE) replaced confrontational interrogation methods with the PEACE model. What is the fundamental operational difference of PEACE?",
    question_type: "multiple_choice",
    options: [
      "It focuses on investigative information-gathering, non-coercive questioning, and open dialogue rather than extracting a pre-determined confession of guilt.",
      "It permits interrogators to administer pharmacological truth serums.",
      "It disallows suspects from speaking to legal counsel until after formal charging.",
      "It guarantees absolute immunity for any suspect who confesses within twenty minutes."
    ],
    correct_answer: "It focuses on investigative information-gathering, non-coercive questioning, and open dialogue rather than extracting a pre-determined confession of guilt.",
    explanation: "PEACE (Planning, Engage, Account, Closure, Evaluation) treats questioning as an objective inquiry to establish facts rather than a psychological contest to force a confession.",
    points: 1,
    order_index: 27
  },
  {
    id: "66666666-6666-4666-8666-000000000029",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Why is the tactic of police lying about non-existent physical evidence (e.g., claiming a suspect's DNA was found on the weapon) particularly dangerous in the case of juvenile suspects?",
    question_type: "multiple_choice",
    options: [
      "Adolescent neurodevelopment features heightened suggestibility, compliance with authority, and immature risk evaluation.",
      "Juveniles are legally exempt from all criminal statutes.",
      "Juvenile fingerprints undergo spontaneous molecular degradation within hours.",
      "Children lack the cognitive capacity to experience fear of imprisonment."
    ],
    correct_answer: "Adolescent neurodevelopment features heightened suggestibility, compliance with authority, and immature risk evaluation.",
    explanation: "Developmental psychology shows that young brains are far more deferential to authority figures and susceptible to believing false authority claims about evidence.",
    points: 1,
    order_index: 28
  },
  {
    id: "66666666-6666-4666-8666-000000000030",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Under English criminal evidence law, Section 76 of PACE requires the trial judge to exclude confession evidence if it was obtained:",
    question_type: "multiple_choice",
    options: [
      "By oppression, or in consequence of anything said or done likely to render the confession unreliable.",
      "Without a minimum of four independent civilian witnesses present.",
      "Outside the geographic boundaries of London.",
      "In the presence of any female police officers."
    ],
    correct_answer: "By oppression, or in consequence of anything said or done likely to render the confession unreliable.",
    explanation: "Section 76 PACE is the statutory safeguard mandating exclusion of confessions extracted via oppression or circumstances undermining evidentiary reliability.",
    points: 1,
    order_index: 29
  },

  // --- Passage 9: Probabilistic Proof & The 'Gatecrasher' Paradox ---
  {
    id: "66666666-6666-4666-8666-000000000031",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'Consider legal philosopher Charles Nesson's famous \"Gatecrasher Paradox\". One thousand spectators attend an exhibition rodeo. The gate receipts show that only 499 individuals purchased entry tickets, meaning that 501 gatecrashed without paying. The promoter sues an arbitrary spectator picked at random from the crowd. Statistically, there is an exact 50.1% probability that this spectator is a gatecrasher. In civil law, the burden of proof is the balance of probabilities (>50%). Yet, courts universally refuse to find liability based solely on naked statistical population proportions. Legal proof requires individualized, case-specific evidence connecting the defendant directly to the wrongful act.'\n\nWhat epistemic principle is illuminated by the Gatecrasher Paradox?",
    question_type: "multiple_choice",
    options: [
      "Mathematical probability alone is insufficient for judicial proof; evidence must establish an individualized causal nexus to the specific defendant.",
      "Rodeo promoters should not be granted civil standing in common-law courts.",
      "The balance of probabilities standard should be numerically defined as precisely 99.9%.",
      "Statistically grounded evidence is always inadmissible in both civil and criminal litigation."
    ],
    correct_answer: "Mathematical probability alone is insufficient for judicial proof; evidence must establish an individualized causal nexus to the specific defendant.",
    explanation: "The paradox demonstrates that law rejects 'naked statistical evidence' because imposing liability without case-specific evidence undermines justice and public confidence.",
    points: 1,
    order_index: 30
  },
  {
    id: "66666666-6666-4666-8666-000000000032",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "If a court accepted pure demographic statistics as satisfying the civil standard of proof in the Gatecrasher scenario, what absurd systemic outcome would follow?",
    question_type: "multiple_choice",
    options: [
      "The promoter could sue and win against every single attendee in the arena, extracting payment 1,000 times even though 499 had already paid.",
      "All criminal cases would immediately be dismissed for lack of statutory jurisdiction.",
      "Spectators would be legally mandated to wear digital tracking wristbands at all sporting events.",
      "The judge would be liable for personal bankruptcy."
    ],
    correct_answer: "The promoter could sue and win against every single attendee in the arena, extracting payment 1,000 times even though 499 had already paid.",
    explanation: "If 50.1% probability sufficed against one random person, it would suffice against every person, allowing recovery against the 499 entirely innocent paying customers.",
    points: 1,
    order_index: 31
  },
  {
    id: "66666666-6666-4666-8666-000000000033",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "What is the 'Prosecutor's Fallacy' in statistical evaluation of criminal evidence?",
    question_type: "multiple_choice",
    options: [
      "Confusing the probability of the evidence given the defendant's innocence with the probability of the defendant's innocence given the evidence.",
      "Assuming that every eyewitness is intentionally attempting to deceive the jury.",
      "Failing to disclose defense expert fees during cross-examination.",
      "Arguing that circumstantial evidence has greater probative weight than direct video footage."
    ],
    correct_answer: "Confusing the probability of the evidence given the defendant's innocence with the probability of the defendant's innocence given the evidence.",
    explanation: "Transposing the conditional probability (P(Evidence|Innocence) vs P(Innocence|Evidence)) mistakenly treats a rare DNA match probability as the direct probability of the defendant being innocent.",
    points: 1,
    order_index: 32
  },
  {
    id: "66666666-6666-4666-8666-000000000034",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "In the tragic UK cot-death case R v Sally Clark (2003), pediatrician Sir Roy Meadow testified that the chance of two sudden infant deaths in one affluent family was 1 in 73 million, calculated by squaring the 1 in 8,500 single-death rate. What fundamental statistical error did this calculation commit?",
    question_type: "multiple_choice",
    options: [
      "Assuming statistical independence between two events that likely shared underlying genetic or environmental risk factors.",
      "Dividing the numerator by an irrational square root.",
      "Using decimal numbers instead of whole fractions in testimony.",
      "Misidentifying the biological gender of the deceased infants."
    ],
    correct_answer: "Assuming statistical independence between two events that likely shared underlying genetic or environmental risk factors.",
    explanation: "Events can only be multiplied if independent; infant deaths in the same household share hereditary genetics and familial environment, rendering the 1 in 73 million figure wildly inaccurate.",
    points: 1,
    order_index: 33
  },

  // --- Passage 10: Deepfakes & The Epistemic Authenticity Crisis ---
  {
    id: "66666666-6666-4666-8666-000000000035",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'The proliferation of generative artificial intelligence and hyper-realistic deepfake technology threatens judicial proceedings with a double-edged crisis known as the \"liar's dividend\". First, fabricated audio and video recordings may be admitted as genuine, misleading triers of fact. Second, and perhaps more insidiously, truly authentic video recordings of criminal wrongdoing can now be plausibly disbelieved by juries because guilty defendants can claim the footage is merely an AI-generated synthetic forgery.'\n\nWhat is the 'liar's dividend' described in the passage?",
    question_type: "multiple_choice",
    options: [
      "The tactical advantage gained by dishonest actors who exploit the mere existence of deepfakes to discredit genuine, incriminating evidence.",
      "A financial bonus awarded to defense attorneys who win acquittals through synthetic evidence.",
      "The statutory tax exemption enjoyed by AI technology software corporations.",
      "A reduction in sentencing guidelines for defendants who plead guilty early."
    ],
    correct_answer: "The tactical advantage gained by dishonest actors who exploit the mere existence of deepfakes to discredit genuine, incriminating evidence.",
    explanation: "The liar's dividend allows wrongdoers to evade accountability by exploiting public skepticism: since deepfakes exist, any real video can be dismissed as fake.",
    points: 1,
    order_index: 34
  },
  {
    id: "66666666-6666-4666-8666-000000000036",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "To combat synthetic media tampering, evidence law increasingly relies on 'cryptographic chain of custody'. What does this procedure verify?",
    question_type: "multiple_choice",
    options: [
      "The immutable provenance, timestamp, and hardware capture metadata of digital footage from the camera sensor to the courtroom.",
      "The psychological mental stability of the videographer at the moment of recording.",
      "The legal ownership of the copyrighted musical score playing in the background.",
      "The political party affiliation of the police evidence custodian."
    ],
    correct_answer: "The immutable provenance, timestamp, and hardware capture metadata of digital footage from the camera sensor to the courtroom.",
    explanation: "Cryptographic hashing and verifiable metadata guarantee that a digital file has not been altered or synthesized since the moment it was recorded.",
    points: 1,
    order_index: 35
  },
  {
    id: "66666666-6666-4666-8666-000000000037",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "If courts respond to the deepfake crisis by reinstating a rigid requirement that all events be proven by live human eyewitnesses rather than recordings, what historical vulnerability do they re-introduce?",
    question_type: "multiple_choice",
    options: [
      "The well-documented fallibility, suggestibility, and memory decay of human perception.",
      "The absolute elimination of all trial appeals.",
      "An uncontrollable escalation in courtroom building heating costs.",
      "The automatic decriminalization of commercial fraud."
    ],
    correct_answer: "The well-documented fallibility, suggestibility, and memory decay of human perception.",
    explanation: "Reverting solely to human testimony would replace the risk of digital forgery with the well-known biological distortions of memory established by psychological research.",
    points: 1,
    order_index: 36
  },

  // --- Passage 11: The Jury System & Cognitive Group Dynamics ---
  {
    id: "66666666-6666-4666-8666-000000000038",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'The common-law jury of twelve citizens is celebrated by Lord Devlin as \"the lamp that shows that freedom lives.\" However, empirical social psychology reveals troubling cognitive dynamics in jury deliberations. Studies demonstrate \"group polarization\": when jurors lean mildly toward a particular verdict prior to deliberation, group discussion often magnifies their collective confidence and drives them to an extreme, polarized stance. Furthermore, lay jurors frequently struggle with complex epidemiological and statistical evidence, defaulting to intuitive narrative coherence rather than probabilistic calculus.'\n\nWhat does the phenomenon of 'group polarization' imply about jury deliberations?",
    question_type: "multiple_choice",
    options: [
      "Deliberation does not always temper extreme views through balanced consensus, but can reinforce and amplify initial preconceptions.",
      "Jurors always split into precisely two equal halves of six votes each.",
      "All twelve jurors inevitably forget the judge's instructions within thirty minutes.",
      "Jury verdicts in common-law nations are statistically indistinguishable from coin tosses."
    ],
    correct_answer: "Deliberation does not always temper extreme views through balanced consensus, but can reinforce and amplify initial preconceptions.",
    explanation: "Social psychological research proves that group discussion often causes individuals to adopt more extreme versions of their initial shared inclinations.",
    points: 1,
    order_index: 37
  },
  {
    id: "66666666-6666-4666-8666-000000000039",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "When lay jurors evaluate competing accounts of a crime, what does the psychological 'Story Model' (Pennington & Hastie) predict they will do?",
    question_type: "multiple_choice",
    options: [
      "Construct a narrative that creates a coherent causal story aligning with their personal world knowledge, even inserting unproven assumptions to fill evidentiary gaps.",
      "Compute Bayes' theorem using paper and pencils in the jury room.",
      "Accept whichever attorney speaks with a deeper vocal timbre.",
      "Disregard all witness testimony in favor of police press releases."
    ],
    correct_answer: "Construct a narrative that creates a coherent causal story aligning with their personal world knowledge, even inserting unproven assumptions to fill evidentiary gaps.",
    explanation: "The Story Model shows that jurors organize evidence into comprehensive stories, valuing narrative plausibility and completeness over rigorous probabilistic analysis.",
    points: 1,
    order_index: 38
  },
  {
    id: "66666666-6666-4666-8666-000000000040",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Which structural argument best justifies retaining lay juries despite cognitive biases?",
    question_type: "multiple_choice",
    options: [
      "Juries inject democratic community standards of justice, prevent judicial tyranny, and confer civic legitimacy on the deprivation of liberty.",
      "Juries are cheaper to operate than salaried professional judges.",
      "Jury verdicts never require formal sentencing hearings.",
      "Twelve citizens never experience tiredness during lengthy trials."
    ],
    correct_answer: "Juries inject democratic community standards of justice, prevent judicial tyranny, and confer civic legitimacy on the deprivation of liberty.",
    explanation: "The constitutional justification for the jury is political and democratic: it distributes sovereign punitive power across society and checks state overreach.",
    points: 1,
    order_index: 39
  },

  // --- Passage 12: Retributivism vs Restorative Justice ---
  {
    id: "66666666-6666-4666-8666-000000000041",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "Passage Excerpt: 'Classical retributivism, articulated by Immanuel Kant, posits that punishment is a categorical moral imperative: the offender must suffer punishment proportional to their desert, irrespective of whether it yields any future rehabilitative or deterrent benefit. Conversely, restorative justice reframes crime not as a violation of an abstract state code, but as a rupture in interpersonal and community relationships. It prioritizes repairing harm through mediated dialogue, offender accountability, and victim restitution.'\n\nWhat is the fundamental difference in how retributive justice and restorative justice conceptualize the primary 'victim' of a crime?",
    question_type: "multiple_choice",
    options: [
      "Retributivism views crime primarily as an offense against the sovereign state and its legal order, whereas restorative justice views crime as harm inflicted on specific individuals and communities.",
      "Retributivism considers the offender to be the primary victim of societal neglect.",
      "Restorative justice refuses to acknowledge the existence of physical injury.",
      "Both frameworks reject the necessity of remorse or accountability."
    ],
    correct_answer: "Retributivism views crime primarily as an offense against the sovereign state and its legal order, whereas restorative justice views crime as harm inflicted on specific individuals and communities.",
    explanation: "In retributive law, the case is 'State v Accused' (breach of sovereign order); in restorative justice, the focus centers on repairing actual human relationships.",
    points: 1,
    order_index: 40
  },
  {
    id: "66666666-6666-4666-8666-000000000042",
    test_id: "66666666-6666-4666-8666-666666666666",
    question_text: "A defense attorney proposes resolving a violent domestic assault case exclusively through informal restorative community mediation without criminal charges. What is the most compelling feminist and victim-advocacy objection to this proposal?",
    question_type: "multiple_choice",
    options: [
      "Informal mediation risks reinforcing structural power imbalances and intimidating vulnerable victims into forced reconciliation without the coercive protection of state law.",
      "Restorative justice requires too many certified psychologists in attendance.",
      "Informal dialogue is prohibited under commercial contract legislation.",
      "Mediation eliminates the financial revenue generated by court fines."
    ],
    correct_answer: "Informal mediation risks reinforcing structural power imbalances and intimidating vulnerable victims into forced reconciliation without the coercive protection of state law.",
    explanation: "Where severe power and physical intimidation dynamics exist, informal mediation can coerce the victim, privatize serious violence, and deny equal protection under the criminal law.",
    points: 1,
    order_index: 41
  }
];

export const PAPER_7_QUESTIONS = [
  // --- Passage 1: The Future of Work (Adapted from official LNAT Practice Test 2, Passage 6) ---
  {
    id: "77777777-7777-4777-8777-000000000001",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: '\"So what do you do?\" In almost every social gathering, this ubiquitous query serves as the primary currency of conversation. We define human status, worth, and identity almost entirely by participation in the formal wage-labor market. Yet, in his 1930 essay \"Economic Possibilities for our Grandchildren,\" John Maynard Keynes predicted that by the early twenty-first century, capital accumulation and technological progress would solve humanity's \"economic problem,\" reducing the working week to a mere fifteen hours. Instead of leisure and liberation, however, the modern economy has generated intense workplace burnout, hyper-specialization, and an explosion of what anthropologist David Graeber dubbed \"bullshit jobs\"—roles perceived as meaningless even by those who hold them.'\n\nWhat is the central paradox highlighted in the passage regarding Keynes's economic prediction?",
    question_type: "multiple_choice",
    options: [
      "Despite immense technological productivity growth that could enable widespread leisure, society has intensified work hours and manufactured superfluous administrative labor.",
      "Keynes failed to anticipate the invention of electronic calculating engines.",
      "Employees universally prefer working seventy hours per week to having free time.",
      "The working class has completely dismantled the global financial system."
    ],
    correct_answer: "Despite immense technological productivity growth that could enable widespread leisure, society has intensified work hours and manufactured superfluous administrative labor.",
    explanation: "Productivity soared as Keynes forecasted, but the expected 15-hour week never arrived; instead, culture and economic systems channeled the surplus into extended hours and administrative roles.",
    points: 1,
    order_index: 0
  },
  {
    id: "77777777-7777-4777-8777-000000000002",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "According to the passage, why is the social question 'So what do you do?' culturally revealing?",
    question_type: "multiple_choice",
    options: [
      "It demonstrates that individual social identity, moral dignity, and prestige remain inextricably tethered to one's occupation within market capitalism.",
      "It indicates that interpersonal etiquette has deteriorated since the Victorian era.",
      "It proves that modern citizens have lost the ability to discuss literature or philosophy.",
      "It reflects a mandatory government surveillance protocol for tax auditing."
    ],
    correct_answer: "It demonstrates that individual social identity, moral dignity, and prestige remain inextricably tethered to one's occupation within market capitalism.",
    explanation: "The author uses the opening question to underscore how human value in modern society is primarily measured through economic employment status.",
    points: 1,
    order_index: 1
  },
  {
    id: "77777777-7777-4777-8777-000000000003",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which of the following unstated assumptions was crucial to Keynes's prediction that technological productivity would lead to a fifteen-hour work week?",
    question_type: "multiple_choice",
    options: [
      "That human material desires would stabilize at a point of sufficiency rather than expanding into insatiable consumer appetites for new luxury goods.",
      "That national governments would outlaw private ownership of factories.",
      "That birth rates would fall to zero in developed economies.",
      "That international trade tariffs would be raised to prohibitive levels."
    ],
    correct_answer: "That human material desires would stabilize at a point of sufficiency rather than expanding into insatiable consumer appetites for new luxury goods.",
    explanation: "For reduced work hours to follow from increased efficiency, consumption needs must remain finite; if desires expand infinitely (consumerism), workers continue trading time for more goods.",
    points: 1,
    order_index: 2
  },
  {
    id: "77777777-7777-4777-8777-000000000004",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "An economic analyst argues: 'David Graeber's concept of \"bullshit jobs\" is purely subjective; if a corporation is willing to pay a salary, the role must generate market value by definition.' What economic assumption does this argument embody?",
    question_type: "multiple_choice",
    options: [
      "Neoclassical market orthodoxy that wages in equilibrium perfectly mirror marginal product, precluding corporate waste or institutional rent-seeking.",
      "The Marxist labor theory of surplus value.",
      "The Austrian school's critique of central monetary planning.",
      "The behavioral economics theory of loss aversion."
    ],
    correct_answer: "Neoclassical market orthodoxy that wages in equilibrium perfectly mirror marginal product, precluding corporate waste or institutional rent-seeking.",
    explanation: "This counter-argument assumes that profit-maximizing firms never hire inefficiently and that private market prices/wages flawlessly equate to real social utility.",
    points: 1,
    order_index: 3
  },

  // --- Passage 2: A Global Dilemma & Collective Action (LNAT Practice Test 1, Passage 12) ---
  {
    id: "77777777-7777-4777-8777-000000000005",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'In the classic Prisoner's Dilemma of game theory, two rational actors pursuing their uncoordinated self-interest inevitably reach a Nash equilibrium that is collectively suboptimal for both. This dilemma operates as a powerful paradigm for contemporary labor markets and international trade. When developing nations compete for foreign direct investment by slashing labor protections, tax rates, and environmental standards, they engage in a destructive \"race to the bottom\". Individually, each nation fears losing capital if it acts with unilateral moral restraint; collectively, all nations forfeit their public revenues and social safety nets.'\n\nWhat makes the 'race to the bottom' in international labor standards an analog of the Prisoner's Dilemma?",
    question_type: "multiple_choice",
    options: [
      "Uncoordinated rational self-interest by individual states produces a mutually destructive outcome that leaves all participants worse off than coordinated cooperation would.",
      "Participating nations are held in literal physical incarceration by international courts.",
      "Neither party has any economic incentive to attract foreign capital investment.",
      "The dilemma can only be resolved if one country conquerors all others militarily."
    ],
    correct_answer: "Uncoordinated rational self-interest by individual states produces a mutually destructive outcome that leaves all participants worse off than coordinated cooperation would.",
    explanation: "Just like the prisoners who both defect and receive worse sentences, countries undercutting each other to attract investment end up collectively gutting their welfare states.",
    points: 1,
    order_index: 4
  },
  {
    id: "77777777-7777-4777-8777-000000000006",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "According to game theory, what is the most robust structural remedy for escaping a Prisoner's Dilemma in international economic competition?",
    question_type: "multiple_choice",
    options: [
      "Binding multilateral conventions with credible enforcement mechanisms and monitoring to penalize defectors.",
      "Appealing solely to the ethical conscience of corporate chief executives.",
      "Abolishing the usage of sovereign national currencies.",
      "Restricting trade negotiations to secret bilateral phone calls."
    ],
    correct_answer: "Binding multilateral conventions with credible enforcement mechanisms and monitoring to penalize defectors.",
    explanation: "Cooperation in a prisoner's dilemma requires external enforcement or repeated-game sanctions so that defecting (undercutting standards) is no longer a dominant strategy.",
    points: 1,
    order_index: 5
  },
  {
    id: "77777777-7777-4777-8777-000000000007",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which of the following domestic labor policies mirrors the collective action solution to the Prisoner's Dilemma?",
    question_type: "multiple_choice",
    options: [
      "Statutory minimum wage legislation and mandatory collective bargaining agreements.",
      "Prohibiting trade unions from organizing workers in manufacturing plants.",
      "Replacing standard hourly pay with discretionary commission-only compensation.",
      "Exempting gig-economy companies from paying national health insurance taxes."
    ],
    correct_answer: "Statutory minimum wage legislation and mandatory collective bargaining agreements.",
    explanation: "Minimum wage laws prevent individual workers from being forced into desperate wage-undercutting competitions, setting a legally enforceable floor.",
    points: 1,
    order_index: 6
  },
  {
    id: "77777777-7777-4777-8777-000000000008",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "A free-market critic claims: 'If workers in developing nations accept low wages and dangerous conditions, it proves that these terms are preferred to their available alternatives.' What is the primary ethical counter-argument to this libertarian claim?",
    question_type: "multiple_choice",
    options: [
      "Coerced choices made under conditions of acute structural deprivation and lack of viable alternatives do not constitute genuine autonomous consent.",
      "Workers in developing nations do not understand basic arithmetic.",
      "Factory jobs produce lower GDP growth than subsistence farming.",
      "Multinational corporations operate at an ongoing financial loss in Asia."
    ],
    correct_answer: "Coerced choices made under conditions of acute structural deprivation and lack of viable alternatives do not constitute genuine autonomous consent.",
    explanation: "Bioethics and jurisprudence recognize that choosing the 'least terrible' among life-threatening options is an exercise in desperation under structural duress, not uncoerced autonomy.",
    points: 1,
    order_index: 7
  },

  // --- Passage 3: Platform Capitalism & Employment Status (Uber BV v Aslam) ---
  {
    id: "77777777-7777-4777-8777-000000000009",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'In the landmark decision Uber BV v Aslam (2021), the UK Supreme Court addressed the legal fiction created by platform tech conglomerates. Uber insisted that its drivers were independent commercial contractors, characterizing its app merely as a digital booking agency facilitating transactions between private drivers and passengers. Lord Leggatt, delivering the unanimous judgment, firmly rejected this contractual formalism. The court held that statutory employment legislation was enacted specifically to protect vulnerable subordinates who have little or no ability to negotiate contractual terms. Because Uber exercised comprehensive algorithmic control—setting non-negotiable fares, imposing vehicle standards, monitoring ratings, and penalizing drivers who declined rides—the drivers were legally \"workers\" entitled to minimum wage and paid leave.'\n\nWhat was the decisive legal doctrine articulated by Lord Leggatt in Uber BV v Aslam regarding employment contracts?",
    question_type: "multiple_choice",
    options: [
      "Courts must look past formal written contractual labels drafted by employers to assess the practical reality of control and economic subordination.",
      "Any business that uses a mobile phone application is exempt from domestic employment laws.",
      "Independent contractors must be granted immediate seats on corporate boards of directors.",
      "Written contracts signed by consenting adults cannot be reviewed or challenged by tribunals."
    ],
    correct_answer: "Courts must look past formal written contractual labels drafted by employers to assess the practical reality of control and economic subordination.",
    explanation: "The Supreme Court ruled that statutory protections cannot be contracted out of by sophisticated corporate contract drafting; the courts examine the factual reality of subordination and control.",
    points: 1,
    order_index: 8
  },
  {
    id: "77777777-7777-4777-8777-000000000010",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "In English employment law, what is the crucial distinction between a 'worker' (Section 230(3)(b) Employment Rights Act 1996) and a traditional 'employee'?",
    question_type: "multiple_choice",
    options: [
      "Workers enjoy basic rights like national minimum wage, working time limits, and holiday pay, but lack protection against unfair dismissal and statutory redundancy pay.",
      "Workers are legally exempt from paying national income tax.",
      "Employees cannot be dismissed under any circumstances.",
      "Workers have no right to be accompanied at disciplinary hearings."
    ],
    correct_answer: "Workers enjoy basic rights like national minimum wage, working time limits, and holiday pay, but lack protection against unfair dismissal and statutory redundancy pay.",
    explanation: "'Worker' is an intermediate statutory tier giving core wage and holiday protections to dependent contractors without granting full employee rights like unfair dismissal protection.",
    points: 1,
    order_index: 9
  },
  {
    id: "77777777-7777-4777-8777-000000000011",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which aspect of Uber's algorithmic management was identified by the Supreme Court as evidence of subordinate control rather than entrepreneurial autonomy?",
    question_type: "multiple_choice",
    options: [
      "Uber's unilateral determination of the ride fare and restriction on drivers communicating directly with riders to establish independent business relations.",
      "The color scheme used in the app interface.",
      "Allowing drivers to select their own personal car insurance providers.",
      "The fact that drivers purchased their own mobile phone data plans."
    ],
    correct_answer: "Uber's unilateral determination of the ride fare and restriction on drivers communicating directly with riders to establish independent business relations.",
    explanation: "Entrepreneurs set their own prices and build client goodwill; Uber controlled the fare and insulated passengers from drivers, proving drivers were not running independent businesses.",
    points: 1,
    order_index: 10
  },
  {
    id: "77777777-7777-4777-8777-000000000012",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "A gig-economy food delivery platform argues: 'Because our couriers can log on and off whenever they choose, they cannot be classified as workers.' How did the Supreme Court resolve this issue regarding working time in Uber v Aslam?",
    question_type: "multiple_choice",
    options: [
      "Flexibility in choosing when to log on does not negate worker status; while logged on and available within the operating territory, drivers are working under the company's control.",
      "The court agreed that flexibility automatically converts all labor into voluntary charity.",
      "The court ruled that all couriers must be forced to work fixed eight-hour shifts.",
      "The court held that delivery couriers are maritime merchant seamen."
    ],
    correct_answer: "Flexibility in choosing when to log on does not negate worker status; while logged on and available within the operating territory, drivers are working under the company's control.",
    explanation: "The Supreme Court held that once drivers were logged into the app ready to accept jobs, they were at Uber's disposal and entitled to minimum wage for that time.",
    points: 1,
    order_index: 11
  },

  // --- Passage 4: Universal Basic Income (UBI) vs Targeted Welfare ---
  {
    id: "77777777-7777-4777-8777-000000000013",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'Universal Basic Income (UBI)—an unconditional, non-means-tested regular cash transfer paid to every adult citizen regardless of work status—has transitioned from radical utopian theory to mainstream economic debate. Advocates argue that by eliminating the punitive bureaucracy and \"welfare cliffs\" of means-tested systems (where earning a modest wage triggers an immediate withdrawal of benefits, creating effective marginal tax rates approaching 90%), UBI restores human dignity and empowers workers to reject dangerous or exploitative employment. Opponents counter with two arguments: astronomical fiscal cost requiring prohibitive taxation, and the moral risk of severing the social contract linking citizenship rights with reciprocal social contribution.'\n\nWhat is the 'welfare cliff' (or poverty trap) described in the passage?",
    question_type: "multiple_choice",
    options: [
      "A disincentive structure in targeted welfare where earning incremental earned income causes a sudden loss of state benefits, leaving the recipient financially worse off or no better off.",
      "A geographic region where municipal welfare offices are located on steep coastal terrain.",
      "The complete absence of any social welfare benefits in low-income neighborhoods.",
      "An automatic legal expulsion from public housing upon reaching the age of 65."
    ],
    correct_answer: "A disincentive structure in targeted welfare where earning incremental earned income causes a sudden loss of state benefits, leaving the recipient financially worse off or no better off.",
    explanation: "Targeted welfare phases out aggressively as recipients earn money, producing near-100% effective marginal tax rates that trap people in poverty by punishing employment.",
    points: 1,
    order_index: 12
  },
  {
    id: "77777777-7777-4777-8777-000000000014",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which ideological argument distinguishes the libertarian defense of UBI (such as Milton Friedman's negative income tax) from the socialist defense of UBI (such as Philippe Van Parijs's 'real freedom for all')?",
    question_type: "multiple_choice",
    options: [
      "Libertarians see UBI as an efficient cash vehicle to dismantle the regulatory state and welfare bureaucracy, whereas socialists view UBI as a tool to emancipate workers from capitalist wage labor dependency.",
      "Libertarians advocate paying UBI exclusively in physical gold coins.",
      "Socialists demand that UBI be funded by abolishing all income taxes on corporate executives.",
      "Libertarians insist that children under five receive double payments."
    ],
    correct_answer: "Libertarians see UBI as an efficient cash vehicle to dismantle the regulatory state and welfare bureaucracy, whereas socialists view UBI as a tool to emancipate workers from capitalist wage labor dependency.",
    explanation: "Right-libertarians embrace UBI to replace complex government departments with market cash; left-egalitarians see it as giving workers the unconditional power to say 'no' to capital.",
    points: 1,
    order_index: 13
  },
  {
    id: "77777777-7777-4777-8777-000000000015",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "How does paying UBI to multi-millionaires satisfy the moral philosophy of 'universality' while remaining fiscally equitable in a progressive tax system?",
    question_type: "multiple_choice",
    options: [
      "Universality eliminates bureaucratic means-testing stigma, while high-income earners pay back vastly more than the transfer through progressive income and wealth taxes.",
      "Millionaires are legally mandated to donate their UBI checks to state museums.",
      "Wealthy citizens are disqualified from voting if they cash their UBI check.",
      "The basic income payment depreciates to zero if kept in a commercial bank account."
    ],
    correct_answer: "Universality eliminates bureaucratic means-testing stigma, while high-income earners pay back vastly more than the transfer through progressive income and wealth taxes.",
    explanation: "Universality preserves social cohesion and avoids intrusive bureaucracy; progressive tax policy on the revenue side claws back the transfer from the rich.",
    points: 1,
    order_index: 14
  },
  {
    id: "77777777-7777-4777-8777-000000000016",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which of the following criticisms represents a 'republican' (civic virtue) objection to Universal Basic Income?",
    question_type: "multiple_choice",
    options: [
      "Democracy requires active civic participation and reciprocal cooperative obligations, which might be eroded if citizens become passive recipients of state dividends.",
      "UBI stimulates excessive domestic consumer spending on electronic appliances.",
      "UBI encourages too many citizens to run for parliamentary election.",
      "Cash payments violate the separation of powers between executive and judicial branches."
    ],
    correct_answer: "Democracy requires active civic participation and reciprocal cooperative obligations, which might be eroded if citizens become passive recipients of state dividends.",
    explanation: "Civic republicanism stresses duty, reciprocal contribution, and active engagement, worrying that unconditional state stipends transform citizens into atomized, passive consumers.",
    points: 1,
    order_index: 15
  },

  // --- Passage 5: Algorithmic Management & Workplace Surveillance ---
  {
    id: "77777777-7777-4777-8777-000000000017",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'The contemporary workplace has witnessed the rise of \"bossware\" and algorithmic management. Warehousing logistics workers and remote white-collar professionals alike are subjected to automated tracking: keystroke logging, webcam eye-tracking, and minute-by-minute metric optimization. When an automated algorithm can terminate an employee for falling below a statistical throughput target without human review, the foundational common-law requirement of natural justice and fair disciplinary procedure is compromised. Article 22 of the EU General Data Protection Regulation (GDPR) establishes a presumptive right not to be subject to a decision based solely on automated processing which produces legal effects, yet corporate employers frequently evade this through nominal human rubber-stamping.'\n\nWhat is the primary threat to employment rights posed by automated algorithmic termination?",
    question_type: "multiple_choice",
    options: [
      "The elimination of individualized human discretion, context sensitivity, and procedural fairness (natural justice) in disciplinary actions.",
      "Algorithmic servers consuming excessive electrical grid power during office hours.",
      "Employees receiving their dismissal notices via digital email rather than posted paper mail.",
      "The risk that computers will accidentally transfer corporate stock into employee accounts."
    ],
    correct_answer: "The elimination of individualized human discretion, context sensitivity, and procedural fairness (natural justice) in disciplinary actions.",
    explanation: "Automated firing treats humans as statistical metrics, stripping away the basic legal right to present mitigating circumstances, explain technical anomalies, or receive a fair hearing.",
    points: 1,
    order_index: 16
  },
  {
    id: "77777777-7777-4777-8777-000000000018",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "According to the passage, how do corporate employers circumvent Article 22 of the GDPR regarding automated decision-making?",
    question_type: "multiple_choice",
    options: [
      "By having human supervisors perform token 'rubber-stamping' of algorithmically generated termination recommendations without genuine independent evaluation.",
      "By relocating their headquarters to international waters.",
      "By renaming all employee dismissal documents as 'voluntary sabbaticals'.",
      "By deleting employee names from corporate payroll databases."
    ],
    correct_answer: "By having human supervisors perform token 'rubber-stamping' of algorithmically generated termination recommendations without genuine independent evaluation.",
    explanation: "To dodge 'solely automated' statutory thresholds, companies introduce a pro forma human sign-off who merely rubber-stamps whatever the algorithm recommended.",
    points: 1,
    order_index: 17
  },
  {
    id: "77777777-7777-4777-8777-000000000019",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "In the context of pervasive remote-work keystroke tracking, which human right under the European Convention on Human Rights (ECHR) is most directly engaged?",
    question_type: "multiple_choice",
    options: [
      "Article 8: The right to respect for private and family life, home, and correspondence.",
      "Article 3: The prohibition against torture and degrading treatment.",
      "Article 10: Freedom of artistic expression in public parks.",
      "Article 12: The right to enter into civil matrimony."
    ],
    correct_answer: "Article 8: The right to respect for private and family life, home, and correspondence.",
    explanation: "ECHR jurisprudence (e.g., Barbulescu v Romania) establishes that employees maintain a legitimate expectation of privacy (Article 8) in digital correspondence and workplace activity.",
    points: 1,
    order_index: 18
  },
  {
    id: "77777777-7777-4777-8777-000000000020",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "A corporate HR executive argues: 'Our warehouse monitoring algorithm is completely objective because it measures only physical barcode scan rates and contains no human racial or gender bias.' What unexamined bias does this argument ignore?",
    question_type: "multiple_choice",
    options: [
      "Disparate impact bias: applying an identical, unyielding scan speed metric systematically discriminates against pregnant, elderly, or disabled workers with legitimate physiological needs.",
      "The algorithm's source code was written in a non-English programming language.",
      "The company's logo uses colors that trigger optical fatigue.",
      "Barcode scanners emit low-frequency sounds that annoy domestic animals."
    ],
    correct_answer: "Disparate impact bias: applying an identical, unyielding scan speed metric systematically discriminates against pregnant, elderly, or disabled workers with legitimate physiological needs.",
    explanation: "Facially neutral metrics can cause severe unlawful indirect discrimination (disparate impact) by penalizing protected groups who cannot match unreasonable physical performance standards.",
    points: 1,
    order_index: 19
  },

  // --- Passage 6: The 'Lump of Labour' Fallacy & AI Automation ---
  {
    id: "77777777-7777-4777-8777-000000000021",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'Economists frequently dismiss fears of technological unemployment by invoking the \"lump of labour fallacy\"—the erroneous assumption that there is a fixed quantity of work to be performed in an economy, such that automating a task permanently extinguishes labor demand. Historically, automation lowered production costs, leading to cheaper goods, increased consumer disposable income, and the creation of entirely new economic industries and professions. Yet, artificial intelligence theorists suggest this historical analogy may falter. Previous automation replaced human muscle with mechanical power, leaving human cognitive capabilities ascendant. If AI successfully substitutes for cognitive and analytical faculties themselves, the human worker may face a structural redundancy akin to the displacement of the horse by the automobile.'\n\nWhat is the core distinction between historical mechanical automation and contemporary AI automation highlighted in the passage?",
    question_type: "multiple_choice",
    options: [
      "Past automation mechanized physical labor while shifting humans into cognitive and analytical roles, whereas AI directly automates cognitive and analytical labor itself.",
      "Historical automation only affected agricultural farming, whereas AI only affects manufacturing.",
      "Mechanical machinery did not require electricity, whereas AI requires fossil fuels.",
      "Past automation was funded entirely by government grants, whereas AI is private."
    ],
    correct_answer: "Past automation mechanized physical labor while shifting humans into cognitive and analytical roles, whereas AI directly automates cognitive and analytical labor itself.",
    explanation: "The historical escape valve was that displaced physical laborers retrained into knowledge/cognitive work; if cognitive tasks are automated, there may be no higher domain for humans to migrate into.",
    points: 1,
    order_index: 20
  },
  {
    id: "77777777-7777-4777-8777-000000000022",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "In the passage, why does the author cite the historical analogy of 'the displacement of the horse by the automobile'?",
    question_type: "multiple_choice",
    options: [
      "To illustrate that technology can render a biological factor of production entirely obsolete without creating substitute employment for that entity.",
      "To advocate for the reintroduction of horse-drawn carriages in urban transit.",
      "To demonstrate that horses had union representation under common law.",
      "To praise the automotive industry for reducing greenhouse gas emissions."
    ],
    correct_answer: "To illustrate that technology can render a biological factor of production entirely obsolete without creating substitute employment for that entity.",
    explanation: "Horses did not become employed in higher-skilled jobs after cars were invented; their economic utility simply vanished, serving as a cautionary metaphor for human labor.",
    points: 1,
    order_index: 21
  },
  {
    id: "77777777-7777-4777-8777-000000000023",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "According to standard economic theory, how does the 'lump of labour fallacy' explain why introducing women into the workforce in the mid-twentieth century did not cause mass male unemployment?",
    question_type: "multiple_choice",
    options: [
      "The expansion of the workforce increased aggregate economic production, generated new household demand, and expanded the overall size of the economic pie.",
      "Male workers voluntarily retired at age thirty.",
      "Female workers were prohibited from receiving wages in legal tender.",
      "Governments raised import tariffs on foreign textiles."
    ],
    correct_answer: "The expansion of the workforce increased aggregate economic production, generated new household demand, and expanded the overall size of the economic pie.",
    explanation: "Labor supply creates its own demand via consumer spending; the economy is not a zero-sum fixed lump, so adding workers expanded total employment.",
    points: 1,
    order_index: 22
  },
  {
    id: "77777777-7777-4777-8777-000000000024",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which of the following interventions represents a Pigouvian policy designed to disincentivize excessive corporate automation at the expense of human employment?",
    question_type: "multiple_choice",
    options: [
      "An automated robotics and AI automation tax aimed at leveling the fiscal playing field between capital and human labor.",
      "Subsidizing corporate software purchases with taxpayer revenue.",
      "Banning universities from teaching computer science courses.",
      "Abolishing all safety regulations in manufacturing plants."
    ],
    correct_answer: "An automated robotics and AI automation tax aimed at leveling the fiscal playing field between capital and human labor.",
    explanation: "A 'robot tax' internalizes the negative social externalities of rapid displacement, slowing deployment and funding worker retraining or public support.",
    points: 1,
    order_index: 23
  },

  // --- Passage 7: Intellectual Property vs Labor in Generative AI ---
  {
    id: "77777777-7777-4777-8777-000000000025",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'Generative AI models are trained on colossal corpora of text, images, and music harvested across the public internet without explicit creator consent or licensing compensation. AI developers defend this practice under the American doctrine of \"fair use\" (or text and data mining exceptions in the UK and EU), arguing that training merely extracts unprotectable statistical correlations and abstract stylistic patterns to create transformative new works. Creative artists and authors vigorously contest this, characterizing mass data scraping as systematic copyright theft and digital enclosure. They contend that AI models do not learn like humans, but act as sophisticated commercial derivative machines competing directly in the marketplace against the very human artists whose life works were ingested to build them.'\n\nWhat is the core doctrinal disagreement in the application of 'fair use' to generative AI training?",
    question_type: "multiple_choice",
    options: [
      "Whether ingesting copyrighted works to train neural network weights is a transformative non-infringing functional use, or an unauthorized commercial exploitation that impairs the market value of original works.",
      "Whether artists should be legally forced to destroy their physical sketchbooks.",
      "Whether text files uploaded to the internet automatically enter the public domain after 24 hours.",
      "Whether computer software code can be printed on paper."
    ],
    correct_answer: "Whether ingesting copyrighted works to train neural network weights is a transformative non-infringing functional use, or an unauthorized commercial exploitation that impairs the market value of original works.",
    explanation: "The central legal conflict pivots on transformative purpose (Factor 1 of fair use) versus market harm and substitution (Factor 4 of fair use).",
    points: 1,
    order_index: 24
  },
  {
    id: "77777777-7777-4777-8777-000000000026",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "How does the legal concept of copyright protect human expression while allowing AI companies to scrape factual data?",
    question_type: "multiple_choice",
    options: [
      "The 'idea-expression dichotomy' holds that copyright protects original creative expression, but never extends to raw facts, ideas, or functional data patterns.",
      "Copyright only protects works created before the year 1900.",
      "Factual data can only be copyrighted by licensed state universities.",
      "All digital information is classified as physical property under maritime law."
    ],
    correct_answer: "The 'idea-expression dichotomy' holds that copyright protects original creative expression, but never extends to raw facts, ideas, or functional data patterns.",
    explanation: "Under the idea-expression dichotomy, anyone can use underlying facts or styles; only the specific creative formulation/expression is shielded by copyright.",
    points: 1,
    order_index: 25
  },
  {
    id: "77777777-7777-4777-8777-000000000027",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "In the United States copyright office ruling regarding Zarya of the Dawn (2023), what did the Register of Copyrights decide regarding AI-generated comic book illustrations?",
    question_type: "multiple_choice",
    options: [
      "Images generated entirely by Midjourney lacked human authorship and could not receive copyright protection, though the human author's text and selection/arrangement were protected.",
      "All comic books were declared public domain.",
      "Midjourney AI was declared the legal author and owner of the royalties.",
      "The artist was fined for using a computer."
    ],
    correct_answer: "Images generated entirely by Midjourney lacked human authorship and could not receive copyright protection, though the human author's text and selection/arrangement were protected.",
    explanation: "Copyright law requires human creative authorship; AI-generated outputs without human brushstroke/creative execution cannot be copyrighted.",
    points: 1,
    order_index: 26
  },
  {
    id: "77777777-7777-4777-8777-000000000028",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which collective bargaining solution was successfully negotiated by the Writers Guild of America (WGA) in 2023 regarding AI in screenwriting?",
    question_type: "multiple_choice",
    options: [
      "AI cannot write or rewrite literary material, and studios cannot use AI-generated output to undermine writers' credits, residuals, or compensation.",
      "Writers agreed to work without pay in exchange for free subscriptions to ChatGPT.",
      "All television scripts must be written exclusively by artificial intelligence.",
      "Studios were banned from using computers in production offices."
    ],
    correct_answer: "AI cannot write or rewrite literary material, and studios cannot use AI-generated output to undermine writers' credits, residuals, or compensation.",
    explanation: "The WGA contract established that AI is not a recognized writer, protecting human credits, residuals, and preventing studios from giving writers cheap AI drafts to edit.",
    points: 1,
    order_index: 27
  },

  // --- Passage 8: Unpaid Care Work & Feminist Economics ---
  {
    id: "77777777-7777-4777-8777-000000000029",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'Conventional measures of macroeconomic prosperity, such as Gross Domestic Product (GDP), were formulated in the 1930s by Simon Kuznets. By design, GDP counts only transactions that pass through the cash nexus of the market. Consequently, as feminist economist Marilyn Waring famously demonstrated, an oil tanker spill or a weapon sale immediately boosts GDP through cleanup and manufacturing expenditures, while the immense unpaid labor of domestic caregiving, child-rearing, and eldercare—disproportionately performed by women worldwide—is counted as economically \"zero\". This systemic statistical omission renders the foundational reproductive work that sustains human civilization completely invisible in policy formulation and national resource allocation.'\n\nWhat is the fundamental critique of Gross Domestic Product (GDP) presented in the passage?",
    question_type: "multiple_choice",
    options: [
      "GDP measures market cash flow rather than human welfare, perversely counting ecological destruction as positive while ignoring essential unpaid reproductive care work.",
      "GDP figures are calculated using inaccurate Roman numerals.",
      "Simon Kuznets intended GDP to measure only the wealth of military generals.",
      "Market capitalism does not require child-rearing or domestic labor to function."
    ],
    correct_answer: "GDP measures market cash flow rather than human welfare, perversely counting ecological destruction as positive while ignoring essential unpaid reproductive care work.",
    explanation: "GDP treats market transactions as output regardless of harm (cleanups, weapons) while completely ignoring non-monetized domestic care work that keeps society functioning.",
    points: 1,
    order_index: 28
  },
  {
    id: "77777777-7777-4777-8777-000000000030",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "How does the exclusion of unpaid domestic labor from national accounts directly perpetuate the gender wealth gap throughout women's lifetimes?",
    question_type: "multiple_choice",
    options: [
      "Periods spent performing unpaid care work result in disrupted market participation, lower cumulative earnings, and reduced contributory retirement pensions.",
      "Women are legally barred from opening personal bank accounts in OECD nations.",
      "Unpaid caregivers are charged higher municipal residential property taxes.",
      "Corporate employers automatically seize the assets of married female employees."
    ],
    correct_answer: "Periods spent performing unpaid care work result in disrupted market participation, lower cumulative earnings, and reduced contributory retirement pensions.",
    explanation: "Taking time out of the workforce for family care limits career progression, wage growth, and contributory state/private pensions, culminating in severe elder poverty.",
    points: 1,
    order_index: 29
  },
  {
    id: "77777777-7777-4777-8777-000000000031",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Which public policy reform is most effective at dismantling the gendered division of domestic labor within households?",
    question_type: "multiple_choice",
    options: [
      "Non-transferable 'use-it-or-lose-it' paid paternity leave reserved exclusively for fathers.",
      "Increasing the general statutory retirement age to seventy-five for all workers.",
      "Banning household electrical appliances to promote manual cooking.",
      "Replacing all nursery schools with commercial boarding facilities."
    ],
    correct_answer: "Non-transferable 'use-it-or-lose-it' paid paternity leave reserved exclusively for fathers.",
    explanation: "Nordic 'daddy quotas' force paternity leave to be taken by fathers rather than transferred to mothers, normalizing male caregiving and reducing maternal career penalties.",
    points: 1,
    order_index: 30
  },
  {
    id: "77777777-7777-4777-8777-000000000032",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "In the famous paradox posed by Arthur Cecil Pigou: 'If a man marries his paid housekeeper, national income decreases; if he divorces her and re-hires her as an employee, national income increases.' What does this paradox illustrate?",
    question_type: "multiple_choice",
    options: [
      "The arbitrary dependency of national income statistics on the legal and marital form of an activity rather than the physical reality of the work performed.",
      "That marriage should be abolished under commercial tax law.",
      "That domestic housekeepers earn higher hourly wages than corporate attorneys.",
      "That divorce courts have no jurisdiction over domestic employment disputes."
    ],
    correct_answer: "The arbitrary dependency of national income statistics on the legal and marital form of an activity rather than the physical reality of the work performed.",
    explanation: "Pigou's riddle highlights that identical domestic cleaning labor is counted in GDP when monetized, but vanishes from GDP when performed within marital relations.",
    points: 1,
    order_index: 31
  },

  // --- Passage 9: Corporate Governance & Shareholder Primacy ---
  {
    id: "77777777-7777-4777-8777-000000000033",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'In 1970, Milton Friedman proclaimed in The New York Times that the sole social responsibility of business is to increase its profits within the rules of the game. For decades, this doctrine of \"shareholder primacy\" dominated corporate law in the United States and the UK, prioritizing short-term quarterly earnings, share buybacks, and executive equity bonuses. Opponents champion the \"stakeholder model\" (or codetermination, as practiced in Germany), which legally obligates directors to weigh the interests of employees, customers, suppliers, the environment, and the broader community alongside shareholder returns.'\n\nWhat is the defining feature of the German system of 'codetermination' (Mitbestimmung) in corporate governance?",
    question_type: "multiple_choice",
    options: [
      "Employees directly elect half of the members of the supervisory board of large public corporations, giving labor a formal voice in governance.",
      "Trade unions are prohibited from participating in any corporate meetings.",
      "Shareholders are forbidden from selling their shares on public stock exchanges.",
      "All corporate profits must be handed over directly to municipal councils."
    ],
    correct_answer: "Employees directly elect half of the members of the supervisory board of large public corporations, giving labor a formal voice in governance.",
    explanation: "Codetermination legally reserves half of supervisory board seats for worker representatives, aligning corporate decisions with long-term labor interests.",
    points: 1,
    order_index: 32
  },
  {
    id: "77777777-7777-4777-8777-000000000034",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "How does Section 172 of the UK Companies Act 2006 formulate a director's general statutory duty?",
    question_type: "multiple_choice",
    options: [
      "To promote the success of the company for the benefit of its members, while having regard to employee interests, community impact, and the long-term consequences of decisions.",
      "To maximize daily share price above all other considerations.",
      "To donate 50% of annual net revenue to charitable foundations.",
      "To dissolve the company immediately if carbon emissions rise."
    ],
    correct_answer: "To promote the success of the company for the benefit of its members, while having regard to employee interests, community impact, and the long-term consequences of decisions.",
    explanation: "Section 172 codifies 'enlightened shareholder value': directors must prioritize company success for shareholders, but must consider employees, environment, and long-term impact.",
    points: 1,
    order_index: 33
  },
  {
    id: "77777777-7777-4777-8777-000000000035",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "A corporate hedge fund argues: 'Share buybacks are the most efficient use of surplus corporate capital because they return money to investors who can allocate it elsewhere.' What is the labor and industrial critique of this practice?",
    question_type: "multiple_choice",
    options: [
      "Buybacks artificially inflate executive stock-option compensation while diverting capital away from research, productive equipment, and employee wage increases.",
      "Buybacks are classified as treason under maritime law.",
      "Shareholders refuse to accept money returned through stock repurchases.",
      "Buybacks cause automated factory machinery to stop functioning."
    ],
    correct_answer: "Buybacks artificially inflate executive stock-option compensation while diverting capital away from research, productive equipment, and employee wage increases.",
    explanation: "Critics highlight that financialized share repurchases cannibalize long-term productive reinvestment in worker wages, innovation, and plant resilience.",
    points: 1,
    order_index: 34
  },

  // --- Passage 10: The Right to Strike & Minimum Service Levels ---
  {
    id: "77777777-7777-4777-8777-000000000036",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'The right of organized workers to withdraw their labor through strikes is protected under International Labour Organization (ILO) Convention 87 and recognized as an integral aspect of freedom of association under Article 11 of the ECHR. However, governments frequently seek to curtail strike action in critical infrastructure—such as healthcare, railways, and fire rescue services—by enacting \"minimum service levels\" legislation. When a statute empowers employers to issue \"work notices\" compelling named individual workers to cross picket lines on pain of dismissal, trade unions argue that the constitutional right to strike is rendered illusory.'\n\nWhat is the fundamental legal tension between minimum service level legislation and international labor law?",
    question_type: "multiple_choice",
    options: [
      "Balancing the public interest in protecting essential public health and safety against the fundamental human right of workers to associate and engage in effective collective withdrawal of labor.",
      "Determining which color warning flags should be flown outside railway stations during winter.",
      "Whether ambulance drivers should be required to wear military uniforms while off duty.",
      "Deciding whether hospital patients are legally permitted to vote in local council elections."
    ],
    correct_answer: "Balancing the public interest in protecting essential public health and safety against the fundamental human right of workers to associate and engage in effective collective withdrawal of labor.",
    explanation: "The core conflict lies between protecting public life and welfare versus gutting workers' only real economic leverage: the collective power to halt labor.",
    points: 1,
    order_index: 35
  },
  {
    id: "77777777-7777-4777-8777-000000000037",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Under the jurisprudence of the European Court of Human Rights in Demir and Baykara v Turkey (2008), the right to collective bargaining and strike action is recognized as:",
    question_type: "multiple_choice",
    options: [
      "An inherent and essential element of the right to freedom of association under Article 11 of the Convention.",
      "An illegal conspiracy against the public treasury.",
      "A temporary privilege granted at the absolute discretion of the executive monarch.",
      "A commercial antitrust violation under European competition law."
    ],
    correct_answer: "An inherent and essential element of the right to freedom of association under Article 11 of the Convention.",
    explanation: "In Demir and Baykara, the ECtHR overturned older precedent to hold that collective bargaining and strike action are integral rights protected under Article 11 ECHR.",
    points: 1,
    order_index: 36
  },
  {
    id: "77777777-7777-4777-8777-000000000038",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Why do trade unions argue that issuing mandatory work notices to individual employees during lawful strikes infringes personal liberty?",
    question_type: "multiple_choice",
    options: [
      "Compelling an individual to perform labor under threat of summary dismissal approaches the character of forced labor under Article 4 of the ECHR.",
      "It requires workers to commute by public buses.",
      "Workers who receive letters are prohibited from watching television.",
      "Dismissed workers are denied access to public libraries."
    ],
    correct_answer: "Compelling an individual to perform labor under threat of summary dismissal approaches the character of forced labor under Article 4 of the ECHR.",
    explanation: "Unions argue that conscripting specific employees to work against their will under pain of immediate firing undermines basic bodily and employment liberty.",
    points: 1,
    order_index: 37
  },

  // --- Passage 11: Supply Chain Liability & Transnational Human Rights ---
  {
    id: "77777777-7777-4777-8777-000000000039",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'In Lungowe v Vedanta Resources plc (2019), the UK Supreme Court addressed whether a British multinational parent company could be held liable in negligence for environmental damage and human rights violations committed by its foreign subsidiary in Zambia. Overturning decades of corporate shield defenses, the Supreme Court ruled that a parent company owes a direct common-law duty of care to communities affected by its overseas operations if it exercises systemic managerial control, supervises subsidiary environmental policies, or publicly holds itself out as responsible for group-wide standards.'\n\nWhat was the profound doctrinal significance of Vedanta for corporate parent liability?",
    question_type: "multiple_choice",
    options: [
      "It established that parent corporations cannot automatically hide behind the separate legal personality of overseas subsidiaries if they actively direct or oversee operational policies.",
      "It ruled that British courts have no jurisdiction outside the British Isles.",
      "It declared all foreign mining operations illegal under English common law.",
      "It mandated that all foreign subsidiaries merge into a single global entity."
    ],
    correct_answer: "It established that parent corporations cannot automatically hide behind the separate legal personality of overseas subsidiaries if they actively direct or oversee operational policies.",
    explanation: "Vedanta breached the corporate veil via common-law tort: parent companies that control or publicize governance over subsidiaries owe a direct duty of care to affected foreign victims.",
    points: 1,
    order_index: 38
  },
  {
    id: "77777777-7777-4777-8777-000000000040",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Under the European Union Corporate Sustainability Due Diligence Directive (CSDDD), what legal duty is imposed on large multinational corporations?",
    question_type: "multiple_choice",
    options: [
      "To conduct mandatory human rights and environmental due diligence across their entire upstream and downstream global supply chains and mitigate identified harms.",
      "To cease importing all raw materials from non-European countries.",
      "To pay all foreign workers in European Union currency.",
      "To submit their annual budgets to the United Nations Security Council."
    ],
    correct_answer: "To conduct mandatory human rights and environmental due diligence across their entire upstream and downstream global supply chains and mitigate identified harms.",
    explanation: "The CSDDD transforms corporate social responsibility into hard law, requiring companies to identify, prevent, and remediate human rights and environmental abuses in their value chains.",
    points: 1,
    order_index: 39
  },

  // --- Passage 12: Intergenerational Inequality & Wealth Taxation ---
  {
    id: "77777777-7777-4777-8777-000000000041",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "Passage Excerpt: 'In Capital in the Twenty-First Century, Thomas Piketty demonstrated that whenever the net rate of return on capital (r) systematically exceeds the overall economic growth rate (g), inherited wealth grows faster than output and wages. Under the formula r > g, meritocracy dissolves as patrimonial capitalism re-emerges: an individual's economic destiny is dictated far more by inherited familial assets than by lifelong labor, education, or effort. To prevent dangerous oligarchic wealth concentration, economists propose progressive annual net wealth taxes and aggressive inheritance estate duties.'\n\nWhat is the sociological consequence of the inequality condition r > g as formulated by Piketty?",
    question_type: "multiple_choice",
    options: [
      "Society regresses toward patrimonial capitalism, where inherited generational wealth eclipses labor income and undermines meritocratic social mobility.",
      "Economic growth accelerates to unprecedented historical speeds.",
      "All private financial capital converts into public infrastructure.",
      "Interest rates set by central banks plummet to permanent negative values."
    ],
    correct_answer: "Society regresses toward patrimonial capitalism, where inherited generational wealth eclipses labor income and undermines meritocratic social mobility.",
    explanation: "When capital returns outpace wage growth ($r > g$), old fortunes accumulate automatically, making inheritance vastly more determinative of wealth than lifetime hard work.",
    points: 1,
    order_index: 40
  },
  {
    id: "77777777-7777-4777-8777-000000000042",
    test_id: "77777777-7777-4777-8777-777777777777",
    question_text: "A conservative philosopher argues against inheritance taxation: 'Parents have a natural moral right to pass their accumulated wealth to their children, and taxing bequests violates family autonomy.' What is the egalitarian philosophical response to this argument?",
    question_type: "multiple_choice",
    options: [
      "Unregulated intergenerational wealth transmission creates vast unearned advantages at birth, directly subverting the foundational liberal principle of fair equality of opportunity.",
      "Children should be declared legal property of the state at age eighteen.",
      "Inherited money always loses its legal purchasing power after forty years.",
      "Family relationships should be prohibited under civil equality statutes."
    ],
    correct_answer: "Unregulated intergenerational wealth transmission creates vast unearned advantages at birth, directly subverting the foundational liberal principle of fair equality of opportunity.",
    explanation: "True equality of opportunity (John Rawls) cannot exist when some children inherit astronomical fortunes while others start with nothing through no fault of their own.",
    points: 1,
    order_index: 41
  }
];

export async function run() {
  console.log('--- Validating Paper 6 and Paper 7 questions ---');
  if (PAPER_6_QUESTIONS.length !== 42) {
    throw new Error(`Paper 6 question count is ${PAPER_6_QUESTIONS.length}, expected 42`);
  }
  if (PAPER_7_QUESTIONS.length !== 42) {
    throw new Error(`Paper 7 question count is ${PAPER_7_QUESTIONS.length}, expected 42`);
  }

  // Validate schema
  for (const q of [...PAPER_6_QUESTIONS, ...PAPER_7_QUESTIONS]) {
    if (!q.id || !q.test_id || !q.question_text || !q.correct_answer || !q.explanation) {
      throw new Error(`Invalid question format for ${q.id}`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question ${q.id} must have exactly 4 options`);
    }
    if (!q.options.includes(q.correct_answer)) {
      throw new Error(`Question ${q.id} correct answer "${q.correct_answer}" not in options!`);
    }
  }
  console.log('✅ Validation passed! Both tests have exactly 42 questions with valid options and answers.');
}
