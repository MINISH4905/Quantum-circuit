---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/subroutine.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/subroutine.py
license: Apache-2.0
---

## Module `pennylane/capture/subroutine.py`

Here we define a mechanism for capturing subroutines by patching the pjit primitive.

While we need to come back and develop custom handling that does not involve patching
jax internals, this will let us build on it for the time being.

We could also just develop a custom higher order primitive like all our other higher order
primitives, but we currently want to be able to cache the jaxpr and the lowering and to
be able to avoid promoting constants to the outer scope. Solving these would take
time we don't have.

We also can't just use the normal ``jit`` primitive, because we currently need to know
which higher order primitive needs to have QReg's added to it's inputs and removed from
it's outputs in Catalyst's ``from_plxpr``.

The steps involved in lowering a subroutine include adding a quantum register input and output, and translating the inside code from plxpr to catalyst jaxpr. The registers are also handled in the aforementioned Catalyst frontend.

Note that this explanation will probably get out of date.

## `subroutine`

```python
def subroutine(func, static_argnums=None, static_argnames=None)
```

Denotes the creation of a function in the intermediate representation.

May be used to reduce compilation times. Instead of repeatedly compiling
inlined versions of the function passed as a parameter, when functions
are annotated with a subroutine, a single version of the function
will be compiled and called from potentially multiple callsites.

.. note::

    Subroutines are only available when using the program capture
    interface. To activate the program capture interface with Catalyst,
    please set `qp.qjit(capture=True)`.

Args:
    subroutine (Callable): the function
    static_argnums (None | int | Sequence[int]): the indices of the static arguments
    static_argnames (None | str | Sequence[str]): the names of static arguments. May be
        provided instead of ``static_argnums`` for readability.

**Example**

.. code-block:: python

    qp.capture.enable()

    @qp.capture.subroutine
    def f(x, wires):
        qp.RX(x, wires)

    @qp.qnode(qp.device('lightning.qubit', wires=5))
    def c(x : float):
        f(x, 0)
        f(x, 1)
        return qp.state()

    print(jax.make_jaxpr(c)(0.5))

.. code-block::

    let f = { lambda ; a:f64[] b:i64[]. let
        _:AbstractOperator() = RX[n_wires=1] a b
    in () } in
    { lambda ; c:f64[]. let
        d:c128[32] = qnode[
        device=<lightning.qubit device (wires=5) at 0x12aac1c40>
        execution_config=ExecutionConfig(grad_on_execution=False, use_device_gradient=None, use_device_jacobian_product=False, gradient_method='best', gradient_keyword_arguments={}, device_options={}, interface=<Interface.JAX: 'jax'>, derivative_order=1, mcm_config=MCMConfig(mcm_method=None, postselect_mode=None), convert_to_numpy=True, executor_backend=<class 'pennylane.concurrency.executors.native.multiproc.MPPoolExec'>)
        n_consts=0
        qfunc_jaxpr={ lambda ; e:f64[]. let
            quantum_subroutine_p[
                compiler_options_kvs=()
                ctx_mesh=Mesh(, axis_types=())
                donated_invars=(False, False)
                in_layouts=(None, None)
                in_shardings=(UnspecifiedValue, UnspecifiedValue)
                inline=False
                jaxpr=f
                keep_unused=False
                name=f
                out_layouts=()
                out_shardings=()
            ] e 0:i64[]
            quantum_subroutine_p[
                compiler_options_kvs=()
                ctx_mesh=Mesh(, axis_types=())
                donated_invars=(False, False)
                in_layouts=(None, None)
                in_shardings=(UnspecifiedValue, UnspecifiedValue)
                inline=False
                jaxpr=f
                keep_unused=False
                name=f
                out_layouts=()
                out_shardings=()
            ] e 1:i64[]
            g:AbstractMeasurement(n_wires=0) = state_wires
            in (g,) }
        qnode=<QNode: device='<lightning.qubit device (wires=5) at 0x12aac1c40>', interface='jax', diff_method='best', shots='Shots(total=None)'>
        shots_len=0
        ] c
    in (d,)

If we create a ``qjit`` version of the QNode, we can inspect the mlir and see a ``FuncOp`` that is
reused for both calls:

>>> qjit_c = qp.qjit(c)
>>> print(qjit_c.mlir[1010:1300]) # doctest: +SKIP
%0 = quantum.alloc( 5) : !quantum.reg
%1 = call @f(%0, %arg0, %c_0) : (!quantum.reg, tensor<f64>, tensor<i64>) -> !quantum.reg
%2 = call @f(%1, %arg0, %c) : (!quantum.reg, tensor<f64>, tensor<i64>) -> !quantum.reg
%3 = quantum.compbasis qreg %2 : !quantum.obs
>>> print(qjit_c.mlir[1465:2070]) # doctest: +SKIP
func.func private @f(%arg0: !quantum.reg, %arg1: tensor<f64>, %arg2: tensor<i64>) -> !quantum.reg attributes {llvm.linkage = #llvm.linkage<internal>} {
    %extracted = tensor.extract %arg2[] : tensor<i64>
    %0 = quantum.extract %arg0[%extracted] : !quantum.reg -> !quantum.bit
    %extracted_0 = tensor.extract %arg1[] : tensor<f64>
    %out_qubits = quantum.custom "RX"(%extracted_0) %0 : !quantum.bit
    %extracted_1 = tensor.extract %arg2[] : tensor<i64>
    %1 = quantum.insert %arg0[%extracted_1], %out_qubits : !quantum.reg, !quantum.bit
    return %1 : !quantum.reg
    }
}
