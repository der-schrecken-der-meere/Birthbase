// use warp::Filter;
// use chrono::{NaiveDate, NaiveDateTime, Utc};

// use super::models::{Birthday, Person};

// pub async fn get_birthday(id: u64) -> Result<impl warp::Reply, warp::Rejection> {
//     let birthday = Birthday {
//         id,
//         person: Person { firstname: String::from("Max"), lastname: String::from("Mustermann") },
//         date: Utc::now(),
//     };
//     Ok(warp::reply::json(&post))
// }