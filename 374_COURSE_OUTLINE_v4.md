# CSE 374 – Software Testing

**Course Length:** 14 weeks

**Course Outcome**

Upon successful completion of this course, students will be able to:

1. **Explain** the role of software testing and quality assurance throughout the software development lifecycle.
2. **Analyze** software requirements to identify ambiguities, omissions, and testable requirements.
3. **Design** software test cases and supporting test data using established software testing techniques.
4. **Develop** a test plan that provides appropriate test coverage based on software requirements and identified risks.
5. **Execute** software tests and accurately document testing results.
6. **Communicate** software quality findings using professional testing artifacts.
7. **Evaluate** software quality by assessing testing evidence and residual risk.
8. **Develop** automated tests for web applications, APIs, and data-driven scenarios.
9. **Integrate** automated tests into continuous integration and delivery workflows.
10. **Evaluate** performance, quality engineering, and AI-assisted testing practices.

The course begins with six weeks of software testing foundations and continues with eight weeks of software test automation and quality engineering.

---

# Weeks 1–6 – Software Testing Foundations

The first six weeks use the Rock Shop project to build a connected portfolio of professional testing artifacts.

## Week 1 – Why Software Testing Matters

### Essential Question

**Why does software testing exist?**

### Topics

#### Software Quality

* What is software quality?
* Quality attributes
* Cost of defects
* Verification vs. validation

#### The Software Development Lifecycle

* Waterfall
* Agile overview
* Where testing fits
* Shift left introduction

#### The Testing Profession

* Roles within QA
* Tester responsibilities
* Collaboration with developers and business analysts

#### Introduction to the Rock Shop

Students receive a product description, business goals, and initial feature list. They begin thinking like testers by asking what they would need to know before testing the application.

### Artifact

**Quality Analysis Memo** – A one-page document describing quality concerns, assumptions, and questions for stakeholders.

## Week 2 – Requirements Analysis and Early Quality

### Essential Question

**What should we test?**

### Topics

* Functional and non-functional requirements
* User stories and acceptance criteria
* Missing, ambiguous, and untestable requirements
* Characteristics of good requirements
* Shift-left practices and requirement reviews

Students receive Rock Shop requirements, user stories, and acceptance criteria.

### Artifacts

* **Requirements Review** – Ambiguities, missing information, assumptions, and stakeholder questions.
* **Initial Test Cases** – Test cases derived directly from requirements.

## Week 3 – Test Design and Tester Thinking

### Essential Question

**How do effective testers discover defects?**

### Topics

* Positive and negative testing
* Boundary value analysis
* Equivalence partitioning
* Error guessing and exploratory testing
* Tester mindset: curiosity, skepticism, observation, and confirmation bias
* Valid, invalid, boundary, and representative test data
* Test basis: requirements, specifications, and existing behavior

Students receive a Rock Shop UI prototype and business rules.

### Artifact

**Test Design Portfolio** – Refined test cases, rationale, designed test data, and identified test basis sources.

## Week 4 – Test Strategy, Planning, and Coverage

### Essential Question

**How do we organize effective testing?**

### Topics

* Test scope, objectives, and entry/exit criteria
* Requirement, feature, and risk coverage
* Smoke, regression, end-to-end, and exploratory testing
* Requirement-to-test traceability

Students receive a Version 1 Rock Shop release plan.

### Artifacts

* **Test Plan** – Scope, assumptions, schedule, strategy, and test environment.
* **Requirements Traceability Matrix** – Mapping requirements to test cases.

## Week 5 – Test Execution and Communicating Quality

### Essential Question

**How do we communicate evidence about software quality?**

### Topics

* Following test procedures and recording observations
* Expected results versus actual results
* Defect lifecycle, severity, priority, and reproduction steps
* Test summaries, recommendations, and supporting conclusions
* Concise bug reports, status reporting, and stakeholder communication

Students receive a working Rock Shop application containing instructor-seeded defects.

### Artifacts

* **Test Execution Log** – Executed tests, results, and observations.
* **Bug Reports** – Professional defect reports.
* **Test Summary Report** – Executive summary of testing results.

## Week 6 – Risk-Based Testing and Quality Assessment

### Essential Question

**Given limited time, what testing matters most?**

### Topics

* Likelihood, impact, and risk prioritization
* Remaining risks and test completeness
* Confidence versus certainty
* Overview of automation, API testing, AI-assisted testing, and continuous testing
* Transition from foundational testing to automation

Students receive a final Rock Shop release candidate with intentionally limited testing time and decide what to test first, what risks remain, and whether the software should ship.

### Artifacts

* **Risk Assessment** – Highest risks, rationale, and recommended testing priorities.
* **Release Recommendation** – Evidence-based recommendation about whether Rock Shop is ready for release.

---

# Weeks 7–14 – Software Test Automation and Quality Engineering

After the six-week Rock Shop testing portfolio, students apply the same testing ideas through automation. The sequence moves from automated checks to broader system quality practices, while repeatedly using earlier artifacts—requirements, test cases, risk priorities, test data, defect evidence, and release recommendations—as the basis for automation decisions.

## Week 7 – Automated Testing with Pytest

### Essential Question

**How do we build automated tests that are reliable, readable, and easy to maintain?**

### Connection to Previous Learning

Students convert selected Week 3 test cases and Week 5 execution checks into automated tests. The requirements and expected results remain the test basis; Pytest becomes a new way to gather repeatable evidence.

### Learning Outcomes

Students will be able to create automated test scripts, use assertions effectively, organize and execute automated test suites, use coverage tools to identify untested code, and select appropriate test levels using the testing pyramid.

### Topics

* The testing pyramid: unit, integration/API, and end-to-end tests
* Choosing a balanced mix of fast, focused tests and broader workflow tests
* Test structure, assertions, fixtures, and parameterized tests
* Naming conventions and test suites
* Test execution and reporting
* Coverage tools such as `coverage.py` and `pytest-cov`
* Line coverage, branch coverage, and missing-line reports

### Evidence of Learning

* Automated test implementation assignment
* Test suite execution report
* Coverage report and analysis of untested code
* Testing pyramid analysis for an existing test suite

## Week 8 – Web Application Test Automation

### Essential Question

**How can we automate realistic user workflows without creating fragile tests?**

### Connection to Previous Learning

Students automate Rock Shop workflows from the Week 3 UI prototype and Week 5 test execution log. Week 4 coverage goals guide which workflows to automate first, and Week 5 bug reports help students include both expected success paths and important failure paths.

### Learning Outcomes

Students will be able to automate browser interactions, validate user workflows, and improve the maintainability of automated tests.

### Topics

* Selenium or Playwright fundamentals
* Element identification, synchronization, and waits
* Page Object Model and reusable test components
* Authentication, forms, and navigation workflows

### Evidence of Learning

* Automated web testing assignment
* Page Object implementation exercise

## Week 9 – API Testing and Automation

### Essential Question

**How do we use automated API tests to verify that systems communicate correctly?**

### Connection to Previous Learning

Students trace user-facing behaviors from the Rock Shop test cases to the services that support them. The Week 4 traceability matrix is extended to connect requirements and UI behavior to API requests, responses, and data contracts.

### Learning Outcomes

Students will be able to validate REST APIs, automate API tests, and analyze API responses.

### Topics

* HTTP methods, status codes, authentication, and JSON
* Python `requests` library
* Response validation and schema verification
* Postman collections, automated checks, and environment variables

### Evidence of Learning

* Automated API test suite
* API validation exercises

## Week 10 – Data-Driven Testing and Database Validation

### Essential Question

**How can test data and database checks help us validate an application more thoroughly?**

### Connection to Previous Learning

Students use the boundary, positive, negative, and representative data designed in Week 3 to drive automated tests. They connect Week 5 observations and Week 6 risk priorities to database checks that verify whether important user actions produce correct stored data.

### Learning Outcomes

Students will be able to separate test data from test logic, validate application data using SQL, and create maintainable automated tests.

### Topics

* External test data from CSV and JSON files
* Parameterized execution
* SQL fundamentals and backend data verification
* Data consistency checks
* Test environments and test data creation

### Evidence of Learning

* SQL validation exercises
* Data-driven test implementation

## Week 11 – Performance Testing and System Quality

### Essential Question

**How do we determine whether a system performs well enough for its users and workload?**

### Connection to Previous Learning

Students expand the Week 1 quality attributes and Week 6 risk assessment by treating performance as measurable system quality. They use user workflows, expected usage, and business impact to choose realistic workloads and interpret performance results.

### Learning Outcomes

Students will be able to design basic performance tests, execute load tests, and interpret performance metrics.

### Topics

* Response time, throughput, latency, and scalability
* JMeter test plans, virtual users, and performance measurements
* Bottleneck analysis, reporting results, and recommendations

### Evidence of Learning

* JMeter performance test
* Performance analysis report

## Week 12 – Continuous Integration and Test Automation Pipelines

### Essential Question

**How can automated tests provide fast, useful feedback throughout software development?**

### Connection to Previous Learning

Students place the automated checks created in Weeks 7–11 into a development workflow. Week 4 entry and exit criteria become pipeline quality gates, while Week 5 test summaries and Week 6 release recommendations become models for reporting automation results to stakeholders.

### Learning Outcomes

Students will be able to integrate automated tests and static analysis into development workflows, understand CI/CD practices, and evaluate automation effectiveness.

### Topics

* Git workflows and pull requests
* Continuous integration and continuous delivery
* Automated quality gates
* Static analysis, linting, and code quality checks
* Finding defects, security concerns, and maintainability problems before runtime
* GitHub Actions and Jenkins overview
* Test reporting in pipelines

### Evidence of Learning

* CI workflow configuration exercise
* Static analysis configuration and results review
* Pipeline execution analysis

## Week 13 – Modern Quality Engineering and AI-Assisted Testing

### Essential Question

**How can quality engineering and AI-assisted testing improve software quality while managing new risks?**

### Connection to Previous Learning

Students revisit the full Rock Shop portfolio and ask how quality ownership changes when testing is supported by automation, cloud services, observability, and AI tools. The Week 6 release recommendation provides a starting point for evaluating whether new tools improve evidence and reduce risk rather than simply increasing the number of tests.

### Learning Outcomes

Students will be able to evaluate emerging testing technologies, use AI tools responsibly in testing workflows, and analyze modern quality engineering practices.

### Topics

* Shift-left testing, quality ownership, and testability
* AI-assisted test generation and maintenance
* AI-assisted defect analysis
* Risks and limitations of AI-assisted testing
* Cloud testing concepts
* Observability and future QA roles

### Evidence of Learning

* AI-assisted testing evaluation
* Modern quality engineering analysis

## Week 14 – Course Review and Final Exam

### Essential Question

**How do we use testing evidence, automation, and professional judgment to make responsible quality decisions?**

### Connection to Previous Learning

Students bring together the complete course sequence: requirements analysis, test design, test planning, execution, defect reporting, risk assessment, automation, performance testing, CI/CD, and modern quality engineering. Review activities should return to the Rock Shop release question: what evidence supports a release decision, and what risks remain?

### Review Topics

* Software quality, the SDLC, and the tester’s role
* Requirements analysis and testability
* Test design techniques and test data
* Test planning, coverage, and traceability
* Test execution, defect reporting, and evidence-based communication
* Risk-based testing and release recommendations
* Pytest, web automation, API testing, and data-driven testing
* Database validation and performance testing
* CI/CD pipelines and automated quality gates
* Quality engineering, cloud testing, observability, and AI-assisted testing

### Evidence of Learning

* Cumulative review activities
* Final exam combining concepts, test design, code reading, result analysis, and quality decision-making

---

# Consolidated Course Sequence

| Weeks | Course focus | Major evidence |
| --- | --- | --- |
| 1–6 | Testing foundations and Rock Shop quality portfolio | Requirements review, test design portfolio, test plan, execution evidence, risk assessment, release recommendation |
| 7 | Pytest automation | Automated test implementation, suite execution report |
| 8–9 | Web and API automation | Automated web tests, Page Object implementation, automated API test suite |
| 10–11 | Data-driven and performance testing | SQL validation, data-driven tests, JMeter performance test, analysis report |
| 12–13 | CI/CD and modern quality engineering | CI workflow, pipeline analysis, AI-assisted testing evaluation |
| 14 | Course review and final exam | Cumulative review and final exam |
