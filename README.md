# sgcl
Kittysune's Soundgasm Codeloader

As Albert Einstein said:
> Everything should be made as simple
> as possible, but no simpler

This is a program that performs a ACE (Arbitrary Code Execution) that transforms your soundgasm audio page.
To make this work, simply include the CND loader in a script.


It works thanks to the less-than-appropiate structure of the site. By no means should this be possible. Honestly, it is
extremely barebones, it is very unnearving to see that this site has been like this for ages!

Anyway, in theory, you can customize your own theme by adding a script with an object like this:
```html
<script>
sgl_style = {
      background_color: '#222',
      text_color: '#fff',
      main_color: '#0aa',
      sec_color: '#088',
      bnt_color: 'w3-indigo',
      wave: '#0FF',
      wave_progress: '#088'
};
</script>
```
