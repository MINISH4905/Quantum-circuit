---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/simulate/params.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/simulate/params.ipynb
license: Apache-2.0
---

##### Copyright 2022 The Cirq Developers

```python
# @title Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

# Parameter Sweeps

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/simulate/params"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/simulate/params.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/simulate/params.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/simulate/params.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
    import cirq
```

## Concept of Circuit Parameterization and Sweeps

Suppose you have a quantum circuit and in this circuit there is a gate with some parameter. You might wish to run this circuit for different values of this parameter.  An example of this type of circuit is a Rabi flop experiment. This experiment runs a set of quantum computations which 1) starts in  $|0\rangle$ state, 2) rotates the state by $\theta$ about the $x$ axis, i.e. applies the gate $\exp(i \theta X)$, and 3) measures the state in the computational basis.  Running this experiment for multiple values of $\theta$, and plotting the probability of observing a $|1\rangle$ outcome yields the quintessential $\cos^2$ probability distribution as a function of the parameter $\theta$.  To support this type of experiment, Cirq provides the concept of parameterized circuits and parameter sweeps.  

The next cell illustrates parameter sweeps with a simple example.  Suppose you want to compare two quantum circuits that are identical except for a single exponentiated `cirq.Z` gate.

```python
q0 = cirq.LineQubit(0)

circuit1 = cirq.Circuit([cirq.H(q0), cirq.Z(q0) ** 0.5, cirq.H(q0), cirq.measure(q0)])
print(f"circuit1:\n{circuit1}")

circuit2 = cirq.Circuit([cirq.H(q0), cirq.Z(q0) ** 0.25, cirq.H(q0), cirq.measure(q0)])
print(f"circuit2:\n{circuit2}")
```

You could run these circuits separately (either on hardware or in simulation), and collect statistics on the results of these circuits. However parameter sweeps can do this in a cleaner and more perfomant manner.  

First define a parameter, and construct a circuit that depends on this parameter. Cirq uses [SymPy](https://www.sympy.org/en/index.html){:external}, a symbolic mathematics package, to define parameters. In this example the Sympy parameter is `theta`, which is used to construct a parameterized circuit.

```python
import sympy

theta = sympy.Symbol("theta")

circuit = cirq.Circuit([cirq.H(q0), cirq.Z(q0) ** theta, cirq.H(q0), cirq.measure(q0)])
print(f"circuit:\n{circuit}")
```

Notice now that the circuit contains a `cirq.Z` gate that is raised to a power, but this power is the parameter `theta`.  This is a "parameterized circuit".  An equivalent way to construct this circuit, where the parameter is actually a parameter in the gate constructor's arguments, is:

```python
circuit = cirq.Circuit(cirq.H(q0), cirq.ZPowGate(exponent=theta)(q0), cirq.H(q0), cirq.measure(q0))
print(f"circuit:\n{circuit}")
```

Note: You can check whether an object in Cirq is parameterized using `cirq.is_parameterized`:

```python
cirq.is_parameterized(circuit)
```

Parameterized circuits are just like normal circuits; they just aren't defined in terms of gates that you can actually run on a quantum computer without the additional information about the values of the parameters.  Following the example above, you can generate the two circuits (`circuit1` and `circuit2`) by using `cirq.resolve_parameter` and supplying the values that you want the parameter(s) to take:

```python
# circuit1 has theta = 0.5
cirq.resolve_parameters(circuit, {"theta": 0.5})
# circuit2 has theta = 0.25
cirq.resolve_parameters(circuit, {"theta": 0.25})
```

More interestingly, you can combine parameterized circuits with a list of parameter assignments when doing things like running circuits or simulating them.  These lists of parameter assignements are called "sweeps".  For example you can use a simulator's `run_sweep` method to run simulations for the parameters corresponding to the two circuits defined above.

```python
sim = cirq.Simulator()
results = sim.run_sweep(circuit, repetitions=25, params=[{"theta": 0.5}, {"theta": 0.25}])
for result in results:
    print(f"param: {result.params}, result: {result}")
```

To recap, you can construct parameterized circuits that depend on parameters that have not yet been assigned a value.  These parameterized circuits can then be resolved to circuits with actual values via a dictionary that maps the sympy variable name to the value that parameter should take. You can also construct lists of dictionaries of parameter assignments, called sweeps, and pass this to many functions in Cirq that use circuits to do an action (such as `simulate` or `run`).  For each of the elements in the sweep, the function will execute using the parameters as described by the element.

## Constructing Sweeps

The previous example constructed a sweep by simply constructing a list of parameter assignments, `[{"theta": 0.5}, {"theta": 0.25}]`.  Cirq also provides other ways to construct sweeps.  

One useful method for constructing parameter sweeps is `cirq.Linspace` which creates a sweep over a list of equally spaced elements.

```python
# Create a sweep over 5 equally spaced values from 0 to 2.5.
params = cirq.Linspace(key="theta", start=0, stop=2.5, length=5)
for param in params:
    print(param)
```

Note: The `Linspace` sweep is composed of `cirq.ParamResolver` instances instead of simple dictionaries. However, you can think of them as effectively the same for most use cases. 

If you need to explicitly and individually specify each parameter resolution, you can do it by constructing a list of dictionaries as before. However, you can also use `cirq.Points` to do this more succinctly.

```python
params = cirq.Points(key="theta", points=[0, 1, 3])
for param in params:
    print(param)
```

If you're working with parameterized circuits, it is very likely you'll need to keep track of multiple parameters. Two common use cases necessitate building a sweep from two constituent sweeps, where the new sweep includes: 
- Every possible combination of the elements of each sweep: A cartesian product. 
- A element-wise pairing of the two sweeps: A zip.

The following are examples of using the `*` and `+` operators to combine sweeps by cartesian product and zipping, respectively.

```python
sweep1 = cirq.Linspace("theta", 0, 1, 5)
sweep2 = cirq.Points("gamma", [0, 3])
# By taking the product of these two sweeps, you can sweep over all possible
# combinations of the parameters.
for param in sweep1 * sweep2:
    print(param)
```

```python
sweep1 = cirq.Points("theta", [1, 2, 3])
sweep2 = cirq.Points("gamma", [0, 3, 4])
# By taking the sum of these two sweeps, you can combine the sweeps
# elementwise (similar to python's zip function):
for param in sweep1 + sweep2:
    print(param)
```

`cirq.Linspace` and `cirq.Points` are instances of the `cirq.Sweep` class, which explicitly supports cartesian product with the `*` operation, and zipping with the `+` operation. The `*` operation produces a `cirq.Product` object, and `+` produces a `cirq.Zip` object, both of which are also `Sweep`s. Other mathematical operations will not work in general *between sweeps*.

## Symbols and Expressions

[SymPy](https://www.sympy.org/en/index.html){:external} is a general symbolic mathematics toolset, and you can leverage this in Cirq to define more complex parameters than have been shown so far. For example, you can define an expression in Sympy and use it to construct circuits that depend on this expression:

```python
# Construct an expression for 0.5 * a + 0.25:
expr = 0.5 * sympy.Symbol("a") + 0.25
print(expr)
```

```python
# Use the expression in the circuit:
circuit = cirq.Circuit(cirq.X(q0) ** expr, cirq.measure(q0))
print(f"circuit:\n{circuit}")
```

Both the exponents and parameter arguments of circuit operations can in fact be any general Sympy expression: The previous examples just used single-variable expressions. When you resolve parameters for this circuit, the expressions are evaluated under the given assignments to the variables in the expression.

```python
print(cirq.resolve_parameters(circuit, {"a": 0}))
```

Just as before, you can pass a sweep over variable values to `run` or `simulate`, and Cirq will evaluate the expression for each possible value.

```python
sim = cirq.Simulator()
results = sim.run_sweep(circuit, repetitions=25, params=cirq.Points('a', [0, 1]))
for result in results:
    print(f"param: {result.params}, result: {result}")
```

Sympy supports a large number of numeric functions and methods, which can be used to create fairly sophisticated expressions, like cosine, exponentiation, and more:

```python
print(sympy.cos(sympy.Symbol("a")) ** sympy.Symbol("b"))
```

Cirq can numerically evaluate all of the expressions Sympy can evalute. However, if you are running a parameterized circuit on a service (such as on a hardware backed quantum computing service) that service may not support evaluating all expressions. See documentation for the particular service you're using for details. 

As a general workaround, you can instead use Cirq's flattening ability to evaluate the parameters before sending them off to the service.

### Flattening Expressions

Suppose you build a circuit that includes multiple different expressions:

```python
a = sympy.Symbol('a')
circuit = cirq.Circuit(cirq.X(q0) ** (a / 4), cirq.Y(q0) ** (1 - a / 2), cirq.measure(q0))
print(circuit)
```

Flattening replaces every expression in the circuit with a new symbol that is representative of the value of that expression. Additionally, it keeps track of the new symbols and provices a `cirq.ExpressionMap` object to map the old sympy expression objects to the new symbols that replaced them.

```python
# Flatten returns two objects, the circuit with new symbols, and the mapping from old to new values.
c_flat, expr_map = cirq.flatten(circuit)
print(c_flat)
print(expr_map)
```

Notice that the new circuit has new symbols, `<a/2>` and `<1-a/2>`, which are explicitly not expressions.  You can see this by looking at the value of the exponent in the first gate:

```python
first_gate = c_flat[0][q0].gate
print(first_gate.exponent)
# Note this is a symbol, not an expression
print(type(first_gate.exponent))
```

The second object returned by `cirq.flatten` is an object that can be used to map sweeps over the previous symbols to new sweeps over the new expression-symbols. The values assigned to the new expression symbols in the resulting sweep are the old expressions kept track of in the `ExpressionMap`, but resolved with the values provided by the original input sweep.

```python
sweep = cirq.Linspace(a, start=0, stop=3, length=4)
print(f"Old {sweep}")

new_sweep = expr_map.transform_sweep(sweep)
print(f"New {new_sweep}")
```

To reinforce: The new sweep is over two new symbols, which each represent the values of the expressions in the original circuit. The values assigned to these new expression symbols is acquired by evaluating the expressions with `a` resolved to a value in `[0, 4]`, according to the old sweep. 

You can use these new sweep elements to resolve the parameters of the flattened circuit:

```python
for params in new_sweep:
    print(c_flat, '=>', end=' ')
    print(cirq.resolve_parameters(c_flat, params))
```

Using `cirq.flatten`, you can always take a parameterized circuit with any complicated expressions, plus a sweep, and produce an equivalent circuit with no expressions, only symbols, and a sweep for these new symbols. Because this is a common flow, Cirq provides `cirq.flatten_sweep` to do this in one step:

```python
c_flat, new_sweep = cirq.flatten_with_sweep(circuit, sweep)
print(c_flat)
print(new_sweep)
```

You can then directly use these objects to run the sweeps. For example, you can use them to perform a simulation:

```python
sim = cirq.Simulator()
results = sim.run_sweep(c_flat, repetitions=20, params=new_sweep)
for result in results:
    print(result.params, result)
```

You can see that the different flattened parameters have corresponding different results for their simulation.

### Immutability of Sweeps

Sweeps and parameter resolvers should be considered immutable objects and should not be modified after creation.

Many of these parameter resolvers use dictionaries for internal storage of symbol mappings.  Though dictionaries are mutable in python, users should not modify internal mappings of resolvers after creation.  Doing so may have undesirable and unpredictable results.

Instead, create a new dictionary and a new parameter resolver object rather than attempting to modify an existing object.

# Summary

- Cirq circuits can handle arbitrary Sympy expressions in place of exponents and parameter arguments in operations.
- By providing one or a sequence of `ParamResolver`s or dictionaries that resolve the Sympy variables to values, `run`, `simulate`, and other functions can iterate efficiently over different parameter assignments for otherwise identical circuits. 
- Sweeps can be created succinctly with `cirq.Points` and `cirq.Linspace`, and composed with each other with `*` and `+`, to create `cirq.Product` and `cirq.Zip` sweeps. 
- When the service you're using does not support arbitrary expressions, you can flatten a circuit and sweep into a new circuit that doesn't have complex expressions, and a corresponding new sweep.
