
## &#x2615; CupOfJoe &#x2615;


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX](#xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
  - [(Almost) A Two-Dimensional Syntax (in a way)](#almost-a-two-dimensional-syntax-in-a-way)
  - [Building Structures with Derived Crammers](#building-structures-with-derived-crammers)
- [Legacy](#legacy)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

### (Almost) A Two-Dimensional Syntax (in a way)



```coffee
cupofjoe          = new ( require 'cupofjoe' ).Cupofjoe()
{ cram, expand }  = cupofjoe.export()

cram 'two', 'three', 'four'
expand()
# => [ [ 'two', 'three', 'four', ], ]
```


```coffee
cupofjoe          = new ( require 'cupofjoe' ).Cupofjoe()
{ cram, expand }  = cupofjoe.export()
cram 'two', ->
  cram 'three'
  cram 'four'

expand()
# => [ [ 'two', 'three', 'four', ], ]
```

### Building Structures with Derived Crammers


```coffee
cupofjoe          = new ( require 'cupofjoe' ).Cupofjoe { flatten: true, }
{ cram, expand }  = cupofjoe.export()

h = ( tagname, content... ) ->
  return cram content...      if ( not tagname? ) or ( tagname is 'text' )
  return cram "<#{tagname}/>" if content.length is 0
  return cram "<#{tagname}>", content..., "</#{tagname}>"

h 'paper', ->
  h 'article', ->
    h 'title', "Some Thoughts on Nested Data Structures"
    h 'par', ->
      h 'text',   "A interesting "
      h 'em',     "fact"
      h 'text',   " about CupOfJoe is that you "
      h 'em',     "can"
      h 'text',   " nest with both sequences and function calls."
  h 'conclusion', ->
    h 'text',   "With CupOfJoe, you don't need brackets."

html = expand().join ''
```

Output (reformatted for readability):

```html
<paper>
  <article>
    <title>Some Thoughts on Nested Data Structures</title>
    <par>
      A interesting <em>fact</em> about CupOfJoe is that you
      <em>can</em> nest with both sequences and function calls.
      </par>
    </article>
  <conclusion>With CupOfJoe, you don't need brackets.</conclusion>
  </paper>
```

## Legacy

```
         Markaby
            ⇓
         CoffeeKup
            ⇓
  CoffeeCup    DryKup  =>  kup
            ⇓
          Teacup
            ⇓
     CoffeNode-Teacup
            ⇓
         CupOfJoe
```

* kup
  * https://github.com/snd/kup
  * forget underpowered template languages - build HTML with the full power of coffeescript

* DryKup
  * https://github.com/mark-hahn/drykup
  * A CoffeScript html generator compatible with CoffeeKup but without the magic.
