import { List } from '../list'

type Relation<A, B> = Array<[A, B]>

const lookup = <A, B> (relation: Relation<A, B>) => (needle: A): List<B> => {
  const bs = relation
    .filter(([a, b]) => a === needle)
    .map(([a, b]) => b)
  return new List(bs)
}

interface Person { personName: string }
const alice = { personName: 'Alice' }
const bob = { personName: 'Bob' }
const eve = { personName: 'Eve' }

interface Job { jobName: string }
const bartending = { jobName: 'Bartending' }
const foodPrep = { jobName: 'Food prep' }
const cook = { jobName: 'Cooking' }
const delivery = { jobName: 'Delivery' }
const tables = { jobName: 'Waiting tables' }

interface Site { siteName: string }
const bar1 = { siteName: 'Floor 1 bar' }
const bar2 = { siteName: 'Floor 2 bar' }
const kitchen = { siteName: 'Kitchen' }
const car1 = { siteName: 'Delivery car 1' }
const car2 = { siteName: 'Delivery car 2' }
const motorbike = { siteName: 'Delivery motorbike' }
const tables1 = { siteName: 'Floor 1 tables' }
const tables2 = { siteName: 'Floor 2 tables' }

interface Qualification { qualificationName: string }
const foodHygiene = { qualificationName: 'Food hygiene certificate' }
const carLicence = { qualificationName: 'Driving licence' }
const motorbikeLicence = { qualificationName: 'Motorbike licence' }

const peopleJobs: Relation<Person, Job> = [
  [alice, bartending],
  [alice, delivery],
  [bob, bartending],
  [bob, foodPrep],
  [bob, cook],
  [eve, foodPrep],
  [eve, cook],
  [eve, tables]
]

const jobSites: Relation<Job, Site> = [
  [bartending, bar1],
  [bartending, bar2],
  [foodPrep, kitchen],
  [cook, kitchen],
  [delivery, car1],
  [delivery, car2],
  [delivery, motorbike],
  [tables, tables1],
  [tables, tables2]
]

const siteQualifications: Relation<Site, Qualification> = [
  [bar1, foodHygiene],
  [bar2, foodHygiene],
  [kitchen, foodHygiene],
  [car1, licence],
  [car2, licence],
  [motorbike, licence]
]

const getQualificationStatements = (person: Person): List<string> => List.box(person)
  .then(lookup(peopleJobs))
  .then(lookup(jobSites))
  .then(lookup(siteQualifications))
  .transform(qualification => `${person.personName} requires qualification ${qualification.qualificationName}`)

const statements = new List([alice, bob, eve]).then(getQualificationStatements).unbox()
statements.map((statement) => console.log(statement))
