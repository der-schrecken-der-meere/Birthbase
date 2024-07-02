// use warp::Filter;
// use crate::handlers;

// pub fn routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
//     get_birthday()
// }

// pub fn get_birthday() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
//     warp::path!("birthdays" / u64)
//         .and(warp::get())
//         .and_then(handlers::get_birthday)
// }