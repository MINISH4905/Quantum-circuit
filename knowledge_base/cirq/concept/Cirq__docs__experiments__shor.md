---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/experiments/shor.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/experiments/shor.ipynb
license: Apache-2.0
---

##### Copyright 2020 The Cirq Developers

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

# Shor's algorithm

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/experiments/shor"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/experiments/shor.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/experiments/shor.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/experiments/shor.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

This tutorial presents a pedagogical demonstration of Shor's algorithm. It is a modified and expanded version of [this Cirq example](https://github.com/quantumlib/Cirq/blob/main/examples/shor.py).

```python
"""Install Cirq."""

try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
```

```python
"""Imports for the notebook."""

import fractions
import math
import random

import numpy as np
import sympy
from typing import Callable, Iterable, Sequence

import cirq
```

# Order finding

Factoring an integer $n$ can be reduced to finding the period of the <i>modular exponential function</i> (to be defined). Finding this period can be accomplished (with high probability) by finding the <i>order</i> of a randomly chosen element of the multiplicative group modulo $n$.

Let $n$ be a positive integer and 

$$ \mathbb{Z}_n := \{x \in \mathbb{Z}_+ : x < n \text{ and } \text{gcd}(x, n) = 1\} $$

be the multiplicative group modulo $n$.
Given $x \in \mathbb{Z}_n$, compute the smallest positive integer $r$ such that $x^r \text{ mod } n = 1$.

It can be shown from group/number theory that:

(1) Such an integer $r$ exists. (Note that $g^{|G|} = 1_G$ for any group $G$ with cardinality $|G|$ and element $g \in G$, but it's possible that $r < |G|$.)

(2) If $n = pq$ for primes $p$ and $q$, then $|\mathbb{Z}_n| = \phi(n) = (p - 1) (q - 1)$. (The function $\phi$ is called [Euler's totient function](https://en.wikipedia.org/wiki/Euler%27s_totient_function).)

(3) The modular exponential function

$$ f_x(z) := x^z \mod n $$

is periodic with period $r$ (the order of the element $x \in \mathbb{Z}_n$). That is, $f_x(z + r) = f_x(z)$. 

(4) If we know the period of the modular exponential function, we can (with high probability) figure out $p$ and $q$ -- that is, factor $n$.

As a refresher, we can visualize the elements of some multiplicative groups $\mathbb{Z}_n$ for integers $n$ via the following simple function.

```python
"""Function to compute the elements of Z_n."""


def multiplicative_group(n: int) -> list[int]:
    """Returns the multiplicative group modulo n.

    Args:
        n: Modulus of the multiplicative group.
    """
    assert n > 1
    group = [1]
    for x in range(2, n):
        if math.gcd(x, n) == 1:
            group.append(x)
    return group
```

For example, the multiplicative group modulo $n = 15$ is shown below.

```python
"""Example of a multiplicative group."""

n = 15
print(f"The multiplicative group modulo n = {n} is:")
print(multiplicative_group(n))
```

One can check that this set of elements indeed forms a group (under ordinary multiplication).

## Classical order finding

A function for classically computing the order $r$ of an element $x \in \mathbb{Z}_n$ is provided below. This function simply computes the sequence 

$$ x^2 \text{ mod } n $$
$$ x^3 \text{ mod } n $$
$$ x^4 \text{ mod } n $$
$$ \vdots $$

until an integer $r$ is found such that $x^r = 1 \text{ mod } n$. Since $|\mathbb{Z}_n| = \phi(n)$, this algorithm for order finding has time complexity $O(\phi(n))$ which is inefficient. (Roughly $O(2^{L / 2})$ where $L$ is the number of bits in $n$.)

```python
"""Function for classically computing the order of an element of Z_n."""


def classical_order_finder(x: int, n: int) -> int | None:
    """Computes smallest positive r such that x**r mod n == 1.

    Args:
        x: Integer whose order is to be computed, must be greater than one
           and belong to the multiplicative group of integers modulo n (which
           consists of positive integers relatively prime to n),
        n: Modulus of the multiplicative group.

    Returns:
        Smallest positive integer r such that x**r == 1 mod n.
        Always succeeds (and hence never returns None).

    Raises:
        ValueError when x is 1 or not an element of the multiplicative
        group of integers modulo n.
    """
    # Make sure x is both valid and in Z_n.
    if x < 2 or x >= n or math.gcd(x, n) > 1:
        raise ValueError(f"Invalid x={x} for modulus n={n}.")

    # Determine the order.
    r, y = 1, x
    while y != 1:
        y = (x * y) % n
        r += 1
    return r
```

An example of computing $r$ for a given $x \in \mathbb{Z}_n$ and given $n$ is shown in the code block below.

```python
"""Example of (classically) computing the order of an element."""

n = 15  # The multiplicative group is [1, 2, 4, 7, 8, 11, 13, 14].
x = 8
r = classical_order_finder(x, n)

# Check that the order is indeed correct.
print(f"x^r mod n = {x}^{r} mod {n} = {x**r % n}")
```

The quantum part of Shor's algorithm is order finding, but done via a quantum circuit, which we'll discuss below.

## Quantum order finding

Quantum order finding is essentially quantum phase estimation with unitary $U$ that computes the modular exponential function $f_x(z)$ for some randomly chosen $x \in \mathbb{Z}_n$. The full details of how $U$ is computed in terms of elementary gates can be complex to unravel, especially on a first reading. In this tutorial, we'll use arithmetic gates in Cirq which can implement such a unitary $U$ without fully delving into the details of elementary gates.

Below we first show an example of a simple arithmetic gate in Cirq (addition) then discuss the gate we care about (modular exponentiation).

### Quantum arithmetic gates in Cirq

Here we discuss an example of defining an arithmetic gate in Cirq, namely modular addition. This gate adds the value of the input register into the target register. More specifically, this gate acts on two qubit registers as

$$ |a\rangle_i |b\rangle_t \mapsto |a\rangle_i |a + b \text{ mod } N_t \rangle_t . $$

Here, the subscripts $i$ and $t$ denote <i>i</i>nput and <i>t</i>arget register, respectively, and $N_t$ is the dimension of the target register.

To define this gate, called `Adder`, we inherit from `cirq.ArithmeticGate` and override the four methods shown below. Note the register arguments specify the shape of the qubits to which they can be applied.

The main method is the `apply` method which defines the arithmetic. Here, we simply state the expression as $a + b$ instead of the more accurate $a + b \text{ mod } N_t$ above -- the `cirq.ArithmeticGate` class is able to deduce what we mean by simply $a + b$ since the gate must be reversible.

```python
"""Example of defining an arithmetic (quantum) gate in Cirq."""


class Adder(cirq.ArithmeticGate):
    """Quantum addition."""

    def __init__(self, target_register: int | Sequence[int], input_register: int | Sequence[int]):
        self.target_register = target_register
        self.input_register = input_register

    def registers(self) -> Sequence[int | Sequence[int]]:
        return self.target_register, self.input_register

    def with_registers(self, *new_registers: int | Sequence[int]) -> 'Adder':
        return Adder(*new_registers)

    def apply(self, *register_values: int) -> int | Iterable[int]:
        return sum(register_values)

    def _circuit_diagram_info_(self, args: cirq.CircuitDiagramInfoArgs):
        wire_symbols = [' + ' for _ in range(len(self.input_register) + len(self.target_register))]
        return cirq.CircuitDiagramInfo(wire_symbols=tuple(wire_symbols))
```

Now that we have the gate defined, we can use it in a circuit. The cell below creates two qubit registers, then sets the first register to be $|10\rangle$ (in binary) and the second register to be $|01\rangle$ (in binary) via $X$ gates. Then, we use the `Adder` gate, then measure all the qubits.

Since $10 + 01 = 11$ (in binary), we expect to measure $|11\rangle$ in the target register every time. Additionally, since we do not alter the input register, we expect to measure $|10\rangle$ in the input register every time. In short, the only bitstring we expect to measure is $1011$.

```python
"""Example of using an Adder in a circuit."""

# Two qubit registers.
qreg1 = cirq.LineQubit.range(2)
qreg2 = cirq.LineQubit.range(2, 4)

# Define an adder gate for two 2D input and target qubits.
adder = Adder(input_register=[2, 2], target_register=[2, 2])

# Define the circuit.
circ = cirq.Circuit(
    cirq.X.on(qreg1[0]),
    cirq.X.on(qreg2[1]),
    adder.on(*qreg1, *qreg2),
    cirq.measure_each(*qreg1),
    cirq.measure_each(*qreg2),
)

# Display it.
print("Circuit:\n")
print(circ)

# Print the measurement outcomes.
print("\n\nMeasurement outcomes:\n")
print(cirq.sample(circ, repetitions=5).data)
```

In the output of this code block, we first see the circuit which shows the initial $X$ gates, the `Adder` gate, then the final measurements. Next, we see the measurement outcomes which are all the bitstring $1011$ as expected.

It is also possible to see the unitary of the adder gate, which we do below. Here, we set the target register to be two qubits in the zero state, i.e. $|00\rangle$. We specify the input register as the integer one which corresponds to the qubit register $|01\rangle$.

```python
"""Example of the unitary of an Adder gate."""

cirq.unitary(Adder(target_register=[2, 2], input_register=1)).real
```

We can understand this unitary as follows. The $i$th column of the unitary is the state $|i + 1 \text{ mod } 4\rangle$. For example, if we look at the $0$th column of the unitary, we see the state $|i + 1 \text{ mod } 4\rangle = |0 + 1 \text{ mod } 4\rangle = |1\rangle$. If we look at the $1$st column of the unitary, we see the state $|i + 1 \text{ mod } 4\rangle = |1 + 1 \text{ mod } 4\rangle = |2\rangle$. Similarly for the last two columns.

### Modular exponential arithmetic gate

We can define the modular exponential arithmetic gate in a similar way to the simple addition arithmetic gate, shown below. For the purposes of understanding Shor's algorithm, the most important part of the following code block is the `apply` method which defines the arithmetic gate.

```python
"""Defines the modular exponential gate used in Shor's algorithm."""


class ModularExp(cirq.ArithmeticGate):
    """Quantum modular exponentiation.

    This class represents the unitary which multiplies base raised to exponent
    into the target modulo the given modulus. More precisely, it represents the
    unitary V which computes modular exponentiation x**e mod n:

        V|y⟩|e⟩ = |y * x**e mod n⟩ |e⟩     0 <= y < n
        V|y⟩|e⟩ = |y⟩ |e⟩                  n <= y

    where y is the target register, e is the exponent register, x is the base
    and n is the modulus. Consequently,

        V|y⟩|e⟩ = (U**e|y)|e⟩

    where U is the unitary defined as

        U|y⟩ = |y * x mod n⟩      0 <= y < n
        U|y⟩ = |y⟩                n <= y
    """

    def __init__(
        self, target: Sequence[int], exponent: int | Sequence[int], base: int, modulus: int
    ) -> None:
        if len(target) < modulus.bit_length():
            raise ValueError(
                f'Register with {len(target)} qubits is too small for modulus' f' {modulus}'
            )
        self.target = target
        self.exponent = exponent
        self.base = base
        self.modulus = modulus

    def registers(self) -> Sequence[int | Sequence[int]]:
        return self.target, self.exponent, self.base, self.modulus

    def with_registers(self, *new_registers: int | Sequence[int]) -> 'ModularExp':
        """Returns a new ModularExp object with new registers."""
        if len(new_registers) != 4:
            raise ValueError(
                f'Expected 4 registers (target, exponent, base, '
                f'modulus), but got {len(new_registers)}'
            )
        target, exponent, base, modulus = new_registers
        if not isinstance(target, Sequence):
            raise ValueError(f'Target must be a qubit register, got {type(target)}')
        if not isinstance(base, int):
            raise ValueError(f'Base must be a classical constant, got {type(base)}')
        if not isinstance(modulus, int):
            raise ValueError(f'Modulus must be a classical constant, got {type(modulus)}')
        return ModularExp(target, exponent, base, modulus)

    def apply(self, *register_values: int) -> int:
        """Applies modular exponentiation to the registers.

        Four values should be passed in.  They are, in order:
          - the target
          - the exponent
          - the base
          - the modulus

        Note that the target and exponent should be qubit
        registers, while the base and modulus should be
        constant parameters that control the resulting unitary.
        """
        assert len(register_values) == 4
        target, exponent, base, modulus = register_values
        if target >= modulus:
            return target
        return (target * base**exponent) % modulus

    def _circuit_diagram_info_(self, args: cirq.CircuitDiagramInfoArgs) -> cirq.CircuitDiagramInfo:
        """Returns a 'CircuitDiagramInfo' object for printing circuits.

        This function just returns information on how to print this operation
        out in a circuit diagram so that the registers are labeled
        appropriately as exponent ('e') and target ('t').
        """
        assert args.known_qubits is not None
        wire_symbols = [f't{i}' for i in range(len(self.target))]
        e_str = str(self.exponent)
        if isinstance(self.exponent, Sequence):
            e_str = 'e'
            wire_symbols += [f'e{i}' for i in range(len(self.exponent))]
        wire_symbols[0] = f'ModularExp(t*{self.base}**{e_str} % {self.modulus})'
        return cirq.CircuitDiagramInfo(wire_symbols=tuple(wire_symbols))
```

In the `apply` method, we see that we evaluate `(target * base**exponent) % modulus`. The `target` and the `exponent` depend on the values of the respective qubit registers, and the `base` and `modulus` are constant -- namely, the `modulus` is $n$ and the `base` is some $x \in \mathbb{Z}_n$.

The total number of qubits we will use is $3 (L + 1)$ where $L$ is the number of bits needed to store the integer $n$ to factor. The size of the unitary which implements the modular exponential is thus $4^{3(L + 1)}$. For a modest $n = 15$, the unitary requires storing $2^{30}$ floating point numbers in memory which is out of reach of most current standard laptops.

```python
"""Create the target and exponent registers for phase estimation,
and see the number of qubits needed for Shor's algorithm.
"""

n = 15
L = n.bit_length()

# The target register has L qubits.
target = cirq.LineQubit.range(L)

# The exponent register has 2L + 3 qubits.
exponent = cirq.LineQubit.range(L, 3 * L + 3)

# Display the total number of qubits to factor this n.
print(f"To factor n = {n} which has L = {L} bits, we need 3L + 3 = {3 * L + 3} qubits.")
```

As with the simple adder gate, this modular exponential gate has a unitary which we can display (memory permitting) as follows.

```python
"""See (part of) the unitary for a modular exponential gate."""

# Pick some element of the multiplicative group modulo n.
x = 5

# Display (part of) the unitary. Uncomment if n is small enough.
# cirq.unitary(ModularExp([2] * L, [2] * (2 * L * 3), x, n))
```

## Using the modular exponential gate in a circuit

The quantum part of Shor's algorithm is just phase estimation with the unitary $U$ corresponding to the modular exponential gate. The following cell defines a function which creates the circuit for Shor's algorithm using the `ModularExp` gate we defined above.

```python
"""Function to make the quantum circuit for order finding."""


def make_order_finding_circuit(x: int, n: int) -> cirq.Circuit:
    """Returns quantum circuit which computes the order of x modulo n.

    The circuit uses Quantum Phase Estimation to compute an eigenvalue of
    the following unitary:

        U|y⟩ = |y * x mod n⟩      0 <= y < n
        U|y⟩ = |y⟩                n <= y

    Args:
        x: positive integer whose order modulo n is to be found
        n: modulus relative to which the order of x is to be found

    Returns:
        Quantum circuit for finding the order of x modulo n
    """
    L = n.bit_length()
    target = cirq.LineQubit.range(L)
    exponent = cirq.LineQubit.range(L, 3 * L + 3)

    # Create a ModularExp gate sized for these registers.
    mod_exp = ModularExp([2] * L, [2] * (2 * L + 3), x, n)

    return cirq.Circuit(
        cirq.X(target[L - 1]),
        cirq.H.on_each(*exponent),
        mod_exp.on(*target, *exponent),
        cirq.qft(*exponent, inverse=True),
        cirq.measure(*exponent, key='exponent'),
    )
```

Using this function, we can visualize the circuit for a given $x$ and $n$ as follows.

```python
"""Example of the quantum circuit for period finding."""

n = 15
x = 7
circuit = make_order_finding_circuit(x, n)
print(circuit)
```

As previously described, we put the exponent register into an equal superposition via Hadamard gates. The $X$ gate on the last qubit in the target register is used for phase kickback. The modular exponential gate performs the sequence of controlled unitaries in phase estimation, then we apply the inverse quantum Fourier transform to the exponent register and measure to read out the result.

To illustrate the measurement results, we can sample from a smaller circuit. (Note that in practice we would never run Shor's algorithm with $n = 6$ because it is even. This is just an example to illustrate the measurement outcomes.)

```python
"""Measuring Shor's period finding circuit."""

circuit = make_order_finding_circuit(x=5, n=6)
res = cirq.sample(circuit, repetitions=8)

print("Raw measurements:")
print(res)

print("\nInteger in exponent register:")
print(res.data)
```

We interpret each measured bitstring as an integer, but what do these integers tell us? In the next section we look at how to classically post-process to interpret them.

## Classical post-processing

The integer we measure is close to $s / r$ where $r$ is the order of $x \in \mathbb{Z}_n$ and $0 \le s < r$ is an integer. We use the continued fractions algorithm to determine $r$ from $s / r$ then return it if the order finding circuit succeeded, else we return `None`.

```python
def process_measurement(result: cirq.Result, x: int, n: int) -> int | None:
    """Interprets the output of the order finding circuit.

    Specifically, it determines s/r such that exp(2πis/r) is an eigenvalue
    of the unitary

        U|y⟩ = |xy mod n⟩  0 <= y < n
        U|y⟩ = |y⟩         n <= y

    then computes r (by continued fractions) if possible, and returns it.

    Args:
        result: result obtained by sampling the output of the
            circuit built by make_order_finding_circuit

    Returns:
        r, the order of x modulo n or None.
    """
    # Read the output integer of the exponent register.
    exponent_as_integer = result.data["exponent"][0]
    exponent_num_bits = result.measurements["exponent"].shape[1]
    eigenphase = float(exponent_as_integer / 2**exponent_num_bits)

    # Run the continued fractions algorithm to determine f = s / r.
    f = fractions.Fraction.from_float(eigenphase).limit_denominator(n)

    # If the numerator is zero, the order finder failed.
    if f.numerator == 0:
        return None

    # Else, return the denominator if it is valid.
    r = f.denominator
    if x**r % n != 1:
        return None
    return r
```

The next code block shows an example of creating an order finding circuit, executing it, then using the classical postprocessing function to determine the order. Recall that the quantum part of the algorithm succeeds with some probability. If the order is `None`, try re-running the cell a few times.

```python
"""Example of the classical post-processing."""

# Set n and x here
n = 6
x = 5

print(f"Finding the order of x = {x} modulo n = {n}\n")
measurement = cirq.sample(circuit, repetitions=1)
print("Raw measurements:")
print(measurement)

print("\nInteger in exponent register:")
print(measurement.data)

r = process_measurement(measurement, x, n)
print("\nOrder r =", r)
if r is not None:
    print(f"x^r mod n = {x}^{r} mod {n} = {x**r % n}")
```

You should see that the order of $x = 5$ in $\mathbb{Z}_6$ is $r = 2$. Indeed, $5^2 \text{ mod } 6 = 25 \text{ mod } 6 = 1$.

## Quantum order finder

We can now define a streamlined function for the quantum version of order finding using the functions we have previously written. The quantum order finder below creates the circuit, executes it, and processes the measurement result.

```python
def quantum_order_finder(x: int, n: int) -> int | None:
    """Computes smallest positive r such that x**r mod n == 1.

    Args:
        x: integer whose order is to be computed, must be greater than one
           and belong to the multiplicative group of integers modulo n (which
           consists of positive integers relatively prime to n),
        n: modulus of the multiplicative group.
    """
    # Check that the integer x is a valid element of the multiplicative group
    # modulo n.
    if x < 2 or n <= x or math.gcd(x, n) > 1:
        raise ValueError(f'Invalid x={x} for modulus n={n}.')

    # Create the order finding circuit.
    circuit = make_order_finding_circuit(x, n)

    # Sample from the order finding circuit.
    measurement = cirq.sample(circuit)

    # Return the processed measurement result.
    return process_measurement(measurement, x, n)
```

This completes our quantum implementation of an order finder, and the quantum part of Shor's algorithm.

# The complete factoring algorithm

We can use this quantum order finder (or the classical order finder) to complete Shor's algorithm. In the following code block, we add a few pre-processing steps which:

(1) Check if $n$ is even,

(2) Check if $n$ is prime,

(3) Check if $n$ is a prime power,

all of which can be done efficiently with a classical computer. Additionally, we add the last necessary post-processing step which uses the order $r$ to compute a non-trivial factor $p$ of $n$. This is achieved by computing $y = x^{r / 2} \text{ mod } n$ (assuming $r$ is even), then computing $p = \text{gcd}(y - 1, n)$.

```python
"""Functions for factoring from start to finish."""


def find_factor_of_prime_power(n: int) -> int | None:
    """Returns non-trivial factor of n if n is a prime power, else None."""
    for k in range(2, math.floor(math.log2(n)) + 1):
        c = math.pow(n, 1 / k)
        c1 = math.floor(c)
        if c1**k == n:
            return c1
        c2 = math.ceil(c)
        if c2**k == n:
            return c2
    return None


def find_factor(
    n: int,
    order_finder: Callable[[int, int], int | None] = quantum_order_finder,
    max_attempts: int = 30,
) -> int | None:
    """Returns a non-trivial factor of composite integer n.

    Args:
        n: Integer to factor.
        order_finder: Function for finding the order of elements of the
            multiplicative group of integers modulo n.
        max_attempts: number of random x's to try, also an upper limit
            on the number of order_finder invocations.

    Returns:
        Non-trivial factor of n or None if no such factor was found.
        Factor k of n is trivial if it is 1 or n.
    """
    # If the number is prime, there are no non-trivial factors.
    if sympy.isprime(n):
        print("n is prime!")
        return None

    # If the number is even, two is a non-trivial factor.
    if n % 2 == 0:
        return 2

    # If n is a prime power, we can find a non-trivial factor efficiently.
    c = find_factor_of_prime_power(n)
    if c is not None:
        return c

    for _ in range(max_attempts):
        # Choose a random number between 2 and n - 1.
        x = random.randint(2, n - 1)

        # Most likely x and n will be relatively prime.
        c = math.gcd(x, n)

        # If x and n are not relatively prime, we got lucky and found
        # a non-trivial factor.
        if 1 < c < n:
            return c

        # Compute the order r of x modulo n using the order finder.
        r = order_finder(x, n)

        # If the order finder failed, try again.
        if r is None:
            continue

        # If the order r is even, try again.
        if r % 2 != 0:
            continue

        # Compute the non-trivial factor.
        y = x ** (r // 2) % n
        assert 1 < y < n
        c = math.gcd(y - 1, n)
        if 1 < c < n:
            return c

    print(f"Failed to find a non-trivial factor in {max_attempts} attempts.")
    return None
```

The function `find_factor` uses the `quantum_order_finder` by default, in which case it is executing Shor's algorithm. As previously mentioned, due to the large memory requirements for classically simulating this circuit, we cannot run Shor's algorithm for $n \ge 15$. However, we can use the classical order finder as a substitute.

```python
"""Example of factoring via Shor's algorithm (order finding)."""

# Number to factor
n = 184573

# Attempt to find a factor
p = find_factor(n, order_finder=classical_order_finder)
q = n // p

print("Factoring n = pq =", n)
print("p =", p)
print("q =", q)
```

```python
"""Check the answer is correct."""

p * q == n
```
