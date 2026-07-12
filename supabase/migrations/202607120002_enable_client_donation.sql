-- Perbolehkan pengguna terautentikasi untuk mencatat donasi mereka sendiri secara langsung dari client
create policy "users insert own donations" 
  on public.donations for insert 
  with check (donor_id = auth.uid() and status = 'recorded');
