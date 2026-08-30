---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/capture_meta.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/capture_meta.py
license: Apache-2.0
---

## Module `pennylane/capture/capture_meta.py`

Defines a metaclass for automatic integration of any ``Operator`` with plxpr program capture.

See ``explanations.md`` for technical explanations of how this works.

## `CaptureMeta`

```python
class CaptureMeta(type)
```

A metatype that dispatches class creation to ``cls._primitive_bind_call`` instead
of normal class creation.

See ``pennylane/capture/explanations.md`` for more detailed information on how this technically
works.

.. code-block::

    qp.capture.enable()

    class AbstractMyObj(jax.core.AbstractValue):
        pass

    class MyObj(metaclass=qp.capture.CaptureMeta):

        primitive = jax.extend.core.Primitive("MyObj")

        @classmethod
        def _primitive_bind_call(cls, a):
            return cls.primitive.bind(a)

        def __init__(self, a):
            self.a = a

    @MyObj.primitive.def_impl
    def _(a):
        return type.__call__(MyObj, a)

    @MyObj.primitive.def_abstract_eval
    def _(a):
        return AbstractMyObj()

>>> jaxpr = jax.make_jaxpr(MyObj)(0.1)
>>> jaxpr
{ lambda ; a:f32[]. let b:AbstractMyObj() = MyObj a in (b,) }
>>> jax.core.eval_jaxpr(jaxpr.jaxpr, jaxpr.consts, 0.1)
[<__main__.MyObj at 0x17fc3ea50>]

## `ABCCaptureMeta`

```python
class ABCCaptureMeta(CaptureMeta, ABCMeta)
```

A combination of the capture meta and ABCMeta
