create table blogs(
    id serial primary key,
    author text,
    url text not null,
    title text not null,
    likes integer default 0
);

insert into blogs (author, url, title) values
('Michael Chan', 'https://reactpatterns.com/', 'React patterns'),
('Dan Abramov', 'https://overreacted.io/', 'On let vs const'),
('Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful');