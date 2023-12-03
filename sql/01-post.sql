create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

create table car
(
  id      integer not null
    constraint car_pk
      primary key autoincrement,
  model text not null,
  description text not null
);
