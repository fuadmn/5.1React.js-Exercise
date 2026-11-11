drop policy if exists "Authors can delete own articles" on public.articles;

create policy "Authors can delete own articles"
on public.articles
for delete
to authenticated
using ((select auth.uid()) = author_id);

drop policy if exists "Article authors can delete their comments" on public.comments;

create policy "Article authors can delete their comments"
on public.comments
for delete
to authenticated
using (
  exists (
    select 1
    from public.articles
    where articles.id = comments.author_id
      and articles.author_id = (select auth.uid())
  )
);
