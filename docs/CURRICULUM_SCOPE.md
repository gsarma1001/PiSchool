# Curriculum scope

## Intended direction

The long-term learning platform is intended to organize math learning
from Kindergarten through Calculus IV. This is a future direction, not a
claim that a complete curriculum or any practice content is currently
available.

## Taxonomy principles

- Organize content by learning level, topic, and subtopic.
- Define learning objectives and prerequisites for each published unit.
- Keep draft and reviewed material distinguishable from published
  material.
- Publish only content that has been checked for age suitability,
  mathematical accuracy, accessibility, and answer validity.

## Calculus scope requires confirmation

Calculus IV does not have a universal course definition. Before assigning
topics, confirm the intended scope with the project owner and align it
with the relevant course sequence. Do not assume a standard topic list.

## Current status

- The catalog controls the two local browsing choices: grades K–5 and
  courses. The following table separates playable topics from the number of
  catalog topics still planned. The complete planned-topic names are listed
  under “View upcoming topics” for each selection in the app.

  | Grade or course | Playable topics | Planned catalog topics |
  |---|---|---:|
  | Kindergarten | Counting collections; Comparing quantities; Patterns; Shapes and attributes | 0 |
  | Grade 1 | Addition and subtraction within 20; Tens and ones; Time and shape attributes | 0 |
  | Grade 2 | Place value to 1,000; Equal groups and skip counting; Money and simple data | 0 |
  | Grade 3 | Multiplication and division; Fractions as equal parts; Area and perimeter | 0 |
  | Grade 4 | Multidigit arithmetic; Equivalent fractions and fraction operations; Angles and measurement | 0 |
  | Grade 5 | Decimal and fraction operations; Volume; Expressions and coordinate grids | 0 |
  | Arithmetic and Number Sense | Place value; Comparing and ordering numbers; Addition; Subtraction; Multiplication; Division; Order of operations; Rounding and estimation; Factors and multiples; Prime numbers; Whole-number operations (mixed review) | 0 |
  | Fractions, Decimals, and Percentages | Adding and subtracting fractions | 7 |
  | Ratios and Proportional Reasoning | Proportions | 7 |
  | Pre-Algebra | One-step and two-step equations | 9 |
  | Algebra 1 | One-step and two-step equations; Function notation | 11 |
  | Geometry | Pythagorean theorem | 13 |
  | Algebra 2 | Quadratic equations | 11 |
  | Trigonometry | Trigonometric ratios | 8 |
  | Precalculus | Trigonometric functions | 11 |
  | Calculus 1 | Differentiation rules | 11 |
  | Calculus 2 | Definite integrals | 13 |
  | Multivariable Calculus | Partial derivatives | 12 |
  | Differential Equations | Separable equations | 8 |
  | Linear Algebra | Determinants | 12 |

  Zero planned catalog topics does not mean complete curriculum coverage;
  the grade-level gaps described below are not yet all represented as topics.
  The earlier committed authored question bank was compared with the current
  bank: existing authored questions remain, and the catalog changes added
  grade-scoped topics. No lost playable bank was identified in that comparison.
- The shared curriculum definitions in `src/lib/curriculum.ts` provide
  US Kindergarten and Grades 1–12 filter options, broader school-level labels,
  and the six elementary Daily Challenge levels. Grade level is separate from
  math course/topic; elementary challenges map internally to the existing
  Arithmetic and Number Sense course without changing its stable course ID.
- Daily Challenge currently has five generated questions at each difficulty
  for all 19 elementary topics: Kindergarten counting, comparing quantities,
  patterns, and shapes/sorting; Grade 1 addition/subtraction within 20,
  place value, and time/shapes; Grade 2 place value, equal groups, and
  money/data; Grade 3 multiplication/division, fractions, and area/perimeter;
  Grade 4 multidigit arithmetic, fractions, and angles/measurement; and
  Grade 5 decimal/fraction operations, volume, and expressions/coordinates.
  Selection is grade-scoped. Elementary answer choices, answer rules, hints,
  and worked solutions are generated on the server; progress follows the
  existing device-local persistence model.
- Elementary challenge coverage is not comprehensive. Kindergarten positional
  language and adding/subtracting with objects, Grade 1 measurement and
  broader word problems, Grade 2 time/measurement, Grade 3 time/graphs and
  multistep problems, Grade 4 factors/multiples and broader conversions, and
  Grade 5 several requested strands need further content. Existing generated
  templates also need independent educator review before production use.
- F07 uses school-stage filters and source-backed grade mappings. Original
  organizer age and school-year labels remain unchanged; an unverified
  equivalence must not become a confirmed grade match.
- The typed curriculum catalog now defines 14 stable course IDs and 154
  distinct advanced-course topic IDs plus 19 elementary topic IDs (173
  distinct topic IDs total), including every topic in the requested advanced
  course list.
  Course and topic display names, descriptions, and display order are stored
  separately from question content. The existing whole-number mixed-review
  topic remains available to preserve its prior challenge bank.
- Arithmetic and Number Sense has five authored questions at each of five
  difficulty levels for every listed topic: place value; comparing and
  ordering numbers; addition; subtraction; multiplication; division; order
  of operations; rounding and estimation; factors and multiples; and prime
  numbers. Its existing whole-number mixed-review bank is also complete.
- Other existing complete banks remain available where their topic and course
  mapping match: adding and subtracting fractions; proportions; one-step and
  two-step equations; function notation; the Pythagorean theorem; quadratic
  equations; trigonometric ratios; differentiation rules; definite integrals;
  partial derivatives; separable equations; and determinants. Shared
  trigonometric ratios use one topic and question bank under Trigonometry and
  Precalculus; linear equations are shared by Pre-Algebra and Algebra 1.
- Topic readiness and the course coverage summary are derived from actual
  question-bank entries. A topic is ready only when it has a verifiable answer,
  hint, and worked solution at each of the five difficulty levels. Incomplete
  topics are marked “Coming soon” and cannot be started.
- The catalog is broader than authored question coverage: future topics are
  intentionally listed but remain unavailable until their complete sets are
  written and checked. Learning objectives, prerequisites, grade-by-grade
  boundaries, and broader subtopic maps remain future work.
- The bank and answer-checking rules are server-side. The challenge saves
  versioned progress in browser local storage; there are no accounts or
  cross-device records.
- The challenge now uses a typed question-service and repository boundary.
  File-backed authored questions and deterministic integer-arithmetic,
  fraction-add/subtract, and linear-equation templates are selected into
  reproducible five-level snapshots. Attempts and cached public snapshots are
  separate fields in device-only progress. See
  `DAILY_CHALLENGE_QUESTION_SYSTEM.md` for the interface, lifecycle, versioning,
  template format, and content authoring instructions.
- Canonical answer rules and required solution fields are checked in tests.
  Independent owner/educator review remains open before production use.
