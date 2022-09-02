//this function should reduce the res from our neo4j queries to be a similar key-value pair
//like the data-structure that came in from Sequelize's data

const recordsReducer = (records) => {

    const reducedResult = records.reduce((recordsAccumulator, record, idxA) => {
   