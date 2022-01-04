create database fullbranas;

create schema fullbranas;

create table fullbranas.items(
    id serial,
    "text" text not null,
    type text not null
);

insert into fullbranas.items(text, type) values ('Am', 'prefix');
insert into fullbranas.items(text, type) values ('Po', 'prefix');
insert into fullbranas.items(text, type) values ('Se', 'suffix');
insert into fullbranas.items(text, type) values ('Ji', 'suffix');
