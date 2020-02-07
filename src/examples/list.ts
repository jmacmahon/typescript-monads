import { List } from '../list'

type Relation<A, B> = Array<[A, B]>

const mergingLookup = <A, B, T extends A> (relation: Relation<A, B>, needleField: keyof A) => (needle: T): List<T & B> => {
  const bs = relation
    .filter(([a, b]) => a[needleField] === needle[needleField])
    .map(([a, b]) => ({ ...needle, ...b }))
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

interface Site { siteName: string }
const bar1 = { siteName: 'Floor 1 bar' }
const bar2 = { siteName: 'Floor 2 bar' }
const kitchen = { siteName: 'Kitchen' }
const car1 = { siteName: 'Delivery car 1' }
const car2 = { siteName: 'Delivery car 2' }
const motorbike = { siteName: 'Delivery motorbike' }

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
  [eve, cook]
]

const jobSites: Relation<Job, Site> = [
  [bartending, bar1],
  [bartending, bar2],
  [foodPrep, kitchen],
  [cook, kitchen],
  [delivery, car1],
  [delivery, car2],
  [delivery, motorbike]
]

const siteQualifications: Relation<Site, Qualification> = [
  [bar1, foodHygiene],
  [bar2, foodHygiene],
  [kitchen, foodHygiene],
  [car1, carLicence],
  [car2, carLicence],
  [motorbike, motorbikeLicence]
]

const getQualificationStatements = (person: Person): List<string> => List.box(person)
  .then(mergingLookup(peopleJobs, 'personName'))
  .then(mergingLookup(jobSites, 'jobName'))
  .then(mergingLookup(siteQualifications, 'siteName'))
  .transform(record => `${record.personName} requires qualification ${record.qualificationName} for job ${record.jobName} at site ${record.siteName}`)

const statements = new List([alice, bob, eve]).then(getQualificationStatements).unbox()
statements.map((statement) => console.log(statement))
