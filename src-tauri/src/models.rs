use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
#[derive()]

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Person {
    pub firstname: String,
    pub lastname: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Birthday {
    pub id: u64,
    pub person: Person,
    pub date: String,
}