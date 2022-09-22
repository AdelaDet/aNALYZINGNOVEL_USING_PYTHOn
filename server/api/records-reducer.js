//this function should reduce the res from our neo4j queries to be a similar key-value pair
//like the data-structure that came in from Sequelize's data

const recordsReducer = (records) => {

    const reducedResult = records.reduce((recordsAccumulator, record, idxA) => {
      recordsAccumulator[idxA] = record.keys.reduce((singleRecordAccumulator, key, idxB) => {
        singleRecordAccumulator[key] = record._fields[idxB]
        return singleRecordAccumulator
      },{})
      return recordsAccumulator
    },[])

  return reducedResult
}

module.exports = recordsReducer

  /*
EXAMPLE INPUT: queryResult.records =
[
  {
    keys: [
      "name",
      "owner",
      "reviewCount",
      "userCount",
      "rating"
    ],
    length: 5,
    _fields: [
      "All About React",
      "dragon-slayer",
      {
        low: 9,
        high: 0
      },
      {
        low: 3,
        high: 0
      },
      4
    ],
    _fieldLookup: {
      name: 0,
      owner: 1,
      reviewCount: 2,
      userCount: 3,
      rating: 4
    }
  },
  .
  .
  .
]

EXAMPLE OUTPUT: returnedArray =
[
  {
    name: "All About React",
    owner: "dragon-slayer",
    reviewCount: {
      low: 9,
      high: 0
    },
    userCount: {
      low: 3,
      high: 0
    },
    rating: 4
    },
  .
  .
  .
]
*/
