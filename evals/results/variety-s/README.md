# Variety score S: before and after (fixtures/variety/)

Log: /tmp/vs2/m/log.json with run #1 = fixtures/variety/a (timeline, paper-feed), run #2 = fixtures/variety/b (timeline, year-ruler).

```
$ node <HEAD 387e131>/scripts/gate.mjs fixtures/variety/a --log /tmp/vs2/m/log.json   # before
S1[last5:archetype-reused,signature-reused,fp100]
$ node <HEAD 387e131>/scripts/gate.mjs fixtures/variety/b --log /tmp/vs2/m/log.json   # before
S1[last5:archetype-reused,signature-new,fp100]
$ node skills/asfakulsiam-motomation-design/scripts/gate.mjs fixtures/variety/a --log /tmp/vs2/m/log.json   # after
S5[last5:none,self-excluded]
$ node skills/asfakulsiam-motomation-design/scripts/gate.mjs fixtures/variety/b --log /tmp/vs2/m/log.json   # after
S1[last5:archetype-reused,signature-new,layout-reused,palette-new,fp100,self-excluded]
```

Before: build a scored S1 against its own entry ("signature-reused" is its own signature). After: a is S5 (nothing logged before it), b is S1 (archetype and layout reused, identical structural fingerprint).
