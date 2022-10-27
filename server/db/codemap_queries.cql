
//Cool queries!

// All paths and related info for user
match(a:User {name:'Mary'})-[:PATHS]->(p:Path)-[*]->(s:Step)-[:RESOURCE]->(r:Resource)
optional match (r)-[*]-(z:Review)
return p,s,r,z

//All paths in a category
match(c:Category {name: 'Data'})<-[:CATEGORY]-(p:Path)
return p

//All resources in a category
match(c:Category {name: 'Data'})<-[:CATEGORY]-(r:Resource)
return r

//Paths in a category, with reviews attached
match(c:Category {name:'Data'})<-[:CATEGORY*]-(p:Path)
with p
optional match (rev:Review)-[:REVIEWS*]-> (p)
return p, rev

//Resources in a category with reviews attached
match(c:Category {name: 'Data'})-[:CATEGORY]-(r:Resource)
match (r)-[*]-(z:Review)
return r, z

//Get a single resource by name
match(r:Resource {name: 'Data Science Toolkit'}) return r




//top 5 paths by review score
match (p:Path)<-[:REVIEWS]-(rev:Review)
return p.name as Path, count(rev) as Reviews, avg(rev.score) as Rating
order by Rating desc
limit 5

//find the top 3 paths ordered by number of connected users, with review score
//will not return paths without reviews!
match(u:User)-[r:PATHS]->(p:Path)<-[:REVIEWS]-(rev:Review)
return p as Path, count(distinct u) as Users, avg(rev.score)