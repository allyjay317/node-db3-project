const knex = require('knex')
const config = require('../knexfile')
const db = knex(config.development)

function find() {
  return db('schemes')
}

function findById(id) {

  return db('schemes')
    .where({ id })
    .first()
}

function findSteps(id) {
  return db('schemes as s').join('steps as p', 's.id', 'p.scheme_id')
    .select('p.id as id', 's.scheme_name', 'p.step_number', 'p.instructions')
    .orderBy('p.step_number')
    .where({ ['s.id']: id })
    .then(steps => {
      //a bit nicer of a way to return it
      const temp = {
        scheme_name: steps[0].scheme_name,
        id: steps[0].id,
        steps: steps.map(({ step_number, instructions }) => { return { step_number, instructions } })
      }
      console.log(temp)
      return steps
    })
    .catch(err => {
      return err
    })
}

async function add(scheme) {
  try {
    dbScheme = {
      scheme_name: scheme.scheme_name
    }
    const index = await db('schemes')
      .insert(dbScheme)
    if (scheme.steps) {
      const steps = await Promise.all(
        scheme.steps.map(async step => {
          return await db('steps')
            .insert({ ...step, scheme_id: index[0] })
        }))
      return {
        scheme: await findById(index[0]),
        steps: await findSteps(index[0])
      }
    }
    else {
      return findById(index[0])
    }
  }
  catch (err) {
    console.log(err)
    return err
  }
}

async function update(changes, id) {
  try {
    //user sent an update with both steps and scheme
    if (changes.steps) {
      let error = false
      //check if any of the steps are missing ids
      changes.steps.forEach(step => !step.id ? error = true : null)
      if (error) {
        //don't update anything, we've been given an invalid object
        return Promise.reject('All steps must have an id to update them')
      }
      //update scheme
      await db('schemes')
        .update({ scheme_name: changes.scheme_name })
        .where({ id })
      //update steps
      const steps = await Promise.all(
        changes.steps.map(async step => {
          {
            return await db('steps')
              .update({
                scheme_id: id,
                step_number: step.step_number,
                instructions: step.instructions
              })
              .where({ id: step.id })
          }
        })
      )
      //return both update scheme, and updated steps
      return {
        scheme: await findById(id),
        steps: await findSteps(id)
      }
    }
    //user only sent update for scheme
    else {
      //update scheme
      await db('schemes')
        .update({ scheme_name: changes.scheme_name })
        .where({ id })
      //return updated scheme
      return findById(id)
    }
  }
  catch (err) {
    //something went wrong somewhere along the line
    return Promise.reject('Sorry, something went wrong while updating')

  }
}

function remove(id) {
  return db('schemes').del().where({ id })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove
}