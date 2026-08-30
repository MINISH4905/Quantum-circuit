---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/hls_plugins.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/hls_plugins.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/hls_plugins.py`

High Level Synthesis Plugins
-----------------------------

Clifford Synthesis
''''''''''''''''''

.. list-table:: Plugins for :class:`qiskit.quantum_info.Clifford` (key = ``"clifford"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Targeted connectivity
      - Description
    * - ``"ag"``
      - :class:`~.AGSynthesisClifford`
      - all-to-all
      - greedily optimizes CX-count
    * - ``"bm"``
      - :class:`~.BMSynthesisClifford`
      - all-to-all
      - optimal count for :math:`n \in \{2,3\}`; used in ``"default"`` for :math:`n \in \{2,3\}`
    * - ``"greedy"``
      - :class:`~.GreedySynthesisClifford`
      - all-to-all
      - greedily optimizes CX-count; used in ``"default"`` for :math:`n\geq 4`
    * - ``"layers"``
      - :class:`~.LayerSynthesisClifford`
      - all-to-all
      -
    * - ``"lnn"``
      - :class:`~.LayerLnnSynthesisClifford`
      - linear
      - many CX-gates but guarantees CX-depth of at most :math:`7n+2`
    * - ``"default"``
      - :class:`~.DefaultSynthesisClifford`
      - all-to-all
      - usually best for optimizing CX-count (and optimal CX-count for :math:`n \in \{2,3\}`)

.. autosummary::
   :toctree: ../stubs/

   AGSynthesisClifford
   BMSynthesisClifford
   GreedySynthesisClifford
   LayerSynthesisClifford
   LayerLnnSynthesisClifford
   DefaultSynthesisClifford


Linear Function Synthesis
'''''''''''''''''''''''''

.. list-table:: Plugins for :class:`.LinearFunction` (key = ``"linear"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Targeted connectivity
      - Description
    * - ``"kms"``
      - :class:`~.KMSSynthesisLinearFunction`
      - linear
      - many CX-gates but guarantees CX-depth of at most :math:`5n`
    * - ``"pmh"``
      - :class:`~.PMHSynthesisLinearFunction`
      - all-to-all
      - greedily optimizes CX-count; used in ``"default"``
    * - ``"default"``
      - :class:`~.DefaultSynthesisLinearFunction`
      - all-to-all
      - best for optimizing CX-count

.. autosummary::
   :toctree: ../stubs/

   KMSSynthesisLinearFunction
   PMHSynthesisLinearFunction
   DefaultSynthesisLinearFunction


Permutation Synthesis
'''''''''''''''''''''

.. list-table:: Plugins for :class:`.PermutationGate` (key = ``"permutation"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Targeted connectivity
      - Description
    * - ``"basic"``
      - :class:`~.BasicSynthesisPermutation`
      - all-to-all
      - optimal SWAP-count; used in ``"default"``
    * - ``"acg"``
      - :class:`~.ACGSynthesisPermutation`
      - all-to-all
      - guarantees SWAP-depth of at most :math:`2`
    * - ``"kms"``
      - :class:`~.KMSSynthesisPermutation`
      - linear
      - many SWAP-gates, but guarantees SWAP-depth of at most :math:`n`
    * - ``"token_swapper"``
      - :class:`~.TokenSwapperSynthesisPermutation`
      - any
      - greedily optimizes SWAP-count for arbitrary connectivity
    * - ``"default"``
      - :class:`~.BasicSynthesisPermutation`
      - all-to-all
      - best for optimizing SWAP-count

.. autosummary::
   :toctree: ../stubs/

   BasicSynthesisPermutation
   ACGSynthesisPermutation
   KMSSynthesisPermutation
   TokenSwapperSynthesisPermutation


QFT Synthesis
'''''''''''''

.. list-table:: Plugins for :class:`.QFTGate` (key = ``"qft"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Targeted connectivity
    * - ``"full"``
      - :class:`~.QFTSynthesisFull`
      - all-to-all
    * - ``"line"``
      - :class:`~.QFTSynthesisLine`
      - linear
    * - ``"default"``
      - :class:`~.QFTSynthesisFull`
      - all-to-all

.. autosummary::
   :toctree: ../stubs/

   QFTSynthesisFull
   QFTSynthesisLine


MCX Synthesis
'''''''''''''

The following table lists synthesis plugins available for an :class:`.MCXGate` gate
with `k` control qubits. If the available number of clean/dirty auxiliary qubits is
not sufficient, the corresponding synthesis method will return `None`.

.. list-table:: Plugins for :class:`.MCXGate` (key = ``"mcx"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Number of clean ancillas
      - Number of dirty ancillas
      - Description
    * - ``"gray_code"``
      - :class:`~.MCXSynthesisGrayCode`
      - `0`
      - `0`
      - exponentially many CX gates; use only for small values of :math:`k`
    * - ``"noaux_v24"``
      - :class:`~.MCXSynthesisNoAuxV24`
      - :math:`0`
      - :math:`0`
      - quadratic number of CX gates
    * - ``"noaux_hp24"``
      - :class:`~.MCXSynthesisNoAuxHP24`
      - :math:`0`
      - :math:`0`
      - linear number of CX gates; use instead of ``"noaux_v24"`` or ``"gray_code"`` for :math:`k>5`
    * - ``"n_clean_m15"``
      - :class:`~.MCXSynthesisNCleanM15`
      - :math:`k-2`
      - :math:`0`
      - at most :math:`6k-6` CX gates
    * - ``"n_dirty_i15"``
      - :class:`~.MCXSynthesisNDirtyI15`
      - :math:`0`
      - :math:`k-2`
      - at most :math:`8k-6` CX gates
    * - ``"2_clean_kg24"``
      - :class:`~.MCXSynthesis2CleanKG24`
      - :math:`2`
      - :math:`0`
      - at most :math:`6k-6` CX gates
    * - ``"2_dirty_kg24"``
      - :class:`~.MCXSynthesis2DirtyKG24`
      - `0`
      - `2`
      - at most :math:`12k-18` CX gates
    * - ``"1_clean_kg24"``
      - :class:`~.MCXSynthesis1CleanKG24`
      - `1`
      - `0`
      - at most :math:`6k-6` CX gates
    * - ``"1_dirty_kg24"``
      - :class:`~.MCXSynthesis1DirtyKG24`
      - :math:`0`
      - :math:`1`
      - at most :math:`12k-18` CX gates
    * - ``"1_clean_b95"``
      - :class:`~.MCXSynthesis1CleanB95`
      - :math:`1`
      - :math:`0`
      - at most :math:`16k-8` CX gates
    * - ``"default"``
      - :class:`~.MCXSynthesisDefault`
      - any
      - any
      - chooses the best algorithm based on the ancillas available

.. autosummary::
   :toctree: ../stubs/

   MCXSynthesisGrayCode
   MCXSynthesisNoAuxV24
   MCXSynthesisNoAuxHP24
   MCXSynthesisNCleanM15
   MCXSynthesisNDirtyI15
   MCXSynthesis2CleanKG24
   MCXSynthesis2DirtyKG24
   MCXSynthesis1CleanKG24
   MCXSynthesis1DirtyKG24
   MCXSynthesis1CleanB95
   MCXSynthesisDefault


MCMT Synthesis
''''''''''''''

.. list-table:: Plugins for :class:`.MCMTGate` (key = ``"mcmt"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Number of clean ancillas
      - Number of dirty ancillas
      - Description
    * - ``"vchain"``
      - :class:`.MCMTSynthesisVChain`
      - :math:`k-1`
      - :math:`0`
      - uses a linear number of Toffoli gates
    * - ``"noaux"``
      - :class:`~.MCMTSynthesisNoAux`
      - :math:`0`
      - :math:`0`
      - uses Qiskit's standard control mechanism
    * - ``"xgate"``
      - :class:`.MCMTSynthesisXGate`
      - :math:`0`
      - :math:`0`
      - uses a linear number of Toffoli gates
    * - ``"default"``
      - :class:`~.MCMTSynthesisDefault`
      - any
      - any
      - chooses the best algorithm based on the ancillas available

.. autosummary::
   :toctree: ../stubs/

   MCMTSynthesisVChain
   MCMTSynthesisNoAux
   MCMTSynthesisXGate
   MCMTSynthesisDefault


Integer comparators
'''''''''''''''''''

.. list-table:: Plugins for :class:`.IntegerComparatorGate` (key = ``"IntComp"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Description
      - Auxiliary qubits
    * - ``"twos"``
      - :class:`~.IntComparatorSynthesis2s`
      - use addition with two's complement
      - :math:`n - 1` clean
    * - ``"noaux"``
      - :class:`~.IntComparatorSynthesisNoAux`
      - flip the target controlled on all :math:`O(2^l)` allowed integer values
      - none
    * - ``"default"``
      - :class:`~.IntComparatorSynthesisDefault`
      - use the best algorithm depending on the available auxiliary qubits
      - any

.. autosummary::
   :toctree: ../stubs/

   IntComparatorSynthesis2s
   IntComparatorSynthesisNoAux
   IntComparatorSynthesisDefault


Sums
''''

.. list-table:: Plugins for :class:`.WeightedSumGate` (key = ``"WeightedSum"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Description
      - Auxiliary qubits
    * - ``"default"``
      - :class:`.WeightedSumSynthesisDefault`
      - use a V-chain based synthesis
      - given :math:`s` sum qubits, used :math:`s - 1_{s \leq 2}` clean auxiliary qubits

.. autosummary::
   :toctree: ../stubs/

   WeightedSumSynthesisDefault


Pauli Evolution Synthesis
'''''''''''''''''''''''''

.. list-table:: Plugins for :class:`.PauliEvolutionGate` (key = ``"PauliEvolution"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Description
      - Targeted connectivity
    * - ``"rustiq"``
      - :class:`~.PauliEvolutionSynthesisRustiq`
      - use the synthesis method from `Rustiq circuit synthesis library
        <https://github.com/smartiel/rustiq-core>`_
      - all-to-all
    * - ``"default"``
      - :class:`~.PauliEvolutionSynthesisDefault`
      - use a diagonalizing Clifford per Pauli term
      - all-to-all

.. autosummary::
   :toctree: ../stubs/

   PauliEvolutionSynthesisDefault
   PauliEvolutionSynthesisRustiq


Modular Adder Synthesis
'''''''''''''''''''''''

.. list-table:: Plugins for :class:`.ModularAdderGate` (key = ``"ModularAdder"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Number of clean ancillas
      - Description
    * - ``"modular_v17"``
      - :class:`.ModularAdderSynthesisV17`
      - :math:`0`
      - a modular adder without any ancillary qubits
    * - ``"ripple_cdkm"``
      - :class:`.ModularAdderSynthesisC04`
      - :math:`1`
      - a ripple-carry adder
    * - ``"ripple_vbe"``
      - :class:`.ModularAdderSynthesisV95`
      - :math:`n-1`, for :math:`n`-bit numbers
      - a ripple-carry adder
    * - ``"qft"``
      - :class:`.ModularAdderSynthesisD00`
      - :math:`0`
      - a QFT-based adder
    * - ``"default"``
      - :class:`~.ModularAdderSynthesisDefault`
      - any
      - chooses the best algorithm based on the ancillas available

.. autosummary::
   :toctree: ../stubs/

   ModularAdderSynthesisV17
   ModularAdderSynthesisC04
   ModularAdderSynthesisD00
   ModularAdderSynthesisV95
   ModularAdderSynthesisDefault

Half Adder Synthesis
''''''''''''''''''''

.. list-table:: Plugins for :class:`.HalfAdderGate` (key = ``"HalfAdder"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Number of clean ancillas
      - Description
    * - ``"ripple_cdkm"``
      - :class:`.HalfAdderSynthesisC04`
      - :math:`1`
      - a ripple-carry adder
    * - ``"ripple_r25"``
      - :class:`.HalfAdderSynthesisR25`
      - :math:`0`
      - a ripple-carry adder with no ancillas
    * - ``"ripple_vbe"``
      - :class:`.HalfAdderSynthesisV95`
      - :math:`n-1`, for :math:`n`-bit numbers
      - a ripple-carry adder
    * - ``"qft"``
      - :class:`.HalfAdderSynthesisD00`
      - :math:`0`
      - a QFT-based adder
    * - ``"default"``
      - :class:`~.HalfAdderSynthesisDefault`
      - any
      - chooses the best algorithm based on the ancillas available

.. autosummary::
   :toctree: ../stubs/

   HalfAdderSynthesisC04
   HalfAdderSynthesisD00
   HalfAdderSynthesisV95
   HalfAdderSynthesisR25
   HalfAdderSynthesisDefault

Full Adder Synthesis
''''''''''''''''''''

.. list-table:: Plugins for :class:`.FullAdderGate` (key = ``"FullAdder"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Number of clean ancillas
      - Description
    * - ``"ripple_cdkm"``
      - :class:`.FullAdderSynthesisC04`
      - :math:`0`
      - a ripple-carry adder
    * - ``"ripple_vbe"``
      - :class:`.FullAdderSynthesisV95`
      - :math:`n-1`, for :math:`n`-bit numbers
      - a ripple-carry adder
    * - ``"default"``
      - :class:`~.FullAdderSynthesisDefault`
      - any
      - chooses the best algorithm based on the ancillas available

.. autosummary::
   :toctree: ../stubs/

   FullAdderSynthesisC04
   FullAdderSynthesisV95
   FullAdderSynthesisDefault


Multiplier Synthesis
''''''''''''''''''''

.. list-table:: Plugins for :class:`.MultiplierGate` (key = ``"Multiplier"``)
    :header-rows: 1

    * - Plugin name
      - Plugin class
      - Number of clean ancillas
      - Description
    * - ``"cumulative"``
      - :class:`.MultiplierSynthesisH18`
      - depending on the :class:`.AdderGate` used
      - a cumulative adder based on controlled adders
    * - ``"qft"``
      - :class:`.MultiplierSynthesisR17`
      - :math:`0`
      - a QFT-based multiplier
    * - ``"default"``
      - :class:`~.MultiplierSynthesisDefault`
      - any
      - chooses the best algorithm based on the ancillas available

.. autosummary::
   :toctree: ../stubs/

   MultiplierSynthesisH18
   MultiplierSynthesisR17
   MultiplierSynthesisDefault

## `DefaultSynthesisClifford`

```python
class DefaultSynthesisClifford(HighLevelSynthesisPlugin)
```

The default clifford synthesis plugin.

For N <= 3 qubits this is the optimal CX cost decomposition by Bravyi, Maslov.
For N > 3 qubits this is done using the general non-optimal greedy compilation
routine from reference by Bravyi, Hu, Maslov, Shaydulin.

This plugin name is :``clifford.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Clifford.

## `AGSynthesisClifford`

```python
class AGSynthesisClifford(HighLevelSynthesisPlugin)
```

Clifford synthesis plugin based on the Aaronson-Gottesman method.

This plugin name is :``clifford.ag`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Clifford.

## `BMSynthesisClifford`

```python
class BMSynthesisClifford(HighLevelSynthesisPlugin)
```

Clifford synthesis plugin based on the Bravyi-Maslov method.

The method only works on Cliffords with at most 3 qubits, for which it
constructs the optimal CX cost decomposition.

This plugin name is :``clifford.bm`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Clifford.

## `GreedySynthesisClifford`

```python
class GreedySynthesisClifford(HighLevelSynthesisPlugin)
```

Clifford synthesis plugin based on the greedy synthesis
Bravyi-Hu-Maslov-Shaydulin method.

This plugin name is :``clifford.greedy`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Clifford.

## `LayerSynthesisClifford`

```python
class LayerSynthesisClifford(HighLevelSynthesisPlugin)
```

Clifford synthesis plugin based on the Bravyi-Maslov method
to synthesize Cliffords into layers.

This plugin name is :``clifford.layers`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Clifford.

## `LayerLnnSynthesisClifford`

```python
class LayerLnnSynthesisClifford(HighLevelSynthesisPlugin)
```

Clifford synthesis plugin based on the Bravyi-Maslov method
to synthesize Cliffords into layers, with each layer synthesized
adhering to LNN connectivity.

This plugin name is :``clifford.lnn`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Clifford.

## `DefaultSynthesisLinearFunction`

```python
class DefaultSynthesisLinearFunction(HighLevelSynthesisPlugin)
```

The default linear function synthesis plugin.

This plugin name is :``linear_function.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given LinearFunction.

## `KMSSynthesisLinearFunction`

```python
class KMSSynthesisLinearFunction(HighLevelSynthesisPlugin)
```

Linear function synthesis plugin based on the Kutin-Moulton-Smithline method.

This plugin name is :``linear_function.kms`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

The plugin supports the following plugin-specific options:

* use_inverted: Indicates whether to run the algorithm on the inverse matrix
    and to invert the synthesized circuit.
    In certain cases this provides a better decomposition than the direct approach.
* use_transposed: Indicates whether to run the algorithm on the transposed matrix
    and to invert the order of CX gates in the synthesized circuit.
    In certain cases this provides a better decomposition than the direct approach.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given LinearFunction.

## `PMHSynthesisLinearFunction`

```python
class PMHSynthesisLinearFunction(HighLevelSynthesisPlugin)
```

Linear function synthesis plugin based on the Patel-Markov-Hayes method.

This plugin name is :``linear_function.pmh`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

The plugin supports the following plugin-specific options:

* section size: The size of each section used in the Patel–Markov–Hayes algorithm [1].
* use_inverted: Indicates whether to run the algorithm on the inverse matrix
    and to invert the synthesized circuit.
    In certain cases this provides a better decomposition than the direct approach.
* use_transposed: Indicates whether to run the algorithm on the transposed matrix
    and to invert the order of CX gates in the synthesized circuit.
    In certain cases this provides a better decomposition than the direct approach.

References:
    1. Patel, Ketan N., Igor L. Markov, and John P. Hayes,
       *Optimal synthesis of linear reversible circuits*,
       Quantum Information & Computation 8.3 (2008): 282-294.
       `arXiv:quant-ph/0302002 [quant-ph] <https://arxiv.org/abs/quant-ph/0302002>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given LinearFunction.

## `KMSSynthesisPermutation`

```python
class KMSSynthesisPermutation(HighLevelSynthesisPlugin)
```

The permutation synthesis plugin based on the Kutin, Moulton, Smithline method.

This plugin name is :``permutation.kms`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Permutation.

## `BasicSynthesisPermutation`

```python
class BasicSynthesisPermutation(HighLevelSynthesisPlugin)
```

The permutation synthesis plugin based on sorting.

This plugin name is :``permutation.basic`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Permutation.

## `ACGSynthesisPermutation`

```python
class ACGSynthesisPermutation(HighLevelSynthesisPlugin)
```

The permutation synthesis plugin based on the Alon, Chung, Graham method.

This plugin name is :``permutation.acg`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Permutation.

## `QFTSynthesisFull`

```python
class QFTSynthesisFull(HighLevelSynthesisPlugin)
```

Synthesis plugin for QFT gates using all-to-all connectivity.

This plugin name is :``qft.full`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

Note that the plugin mechanism is not applied if the gate is called ``qft`` but
is not an instance of ``QFTGate``. This allows users to create custom gates with
name ``qft``.

The plugin supports the following additional options:

* reverse_qubits (bool): Whether to synthesize the "QFT" operation (if ``False``,
    which is the default) or the "QFT-with-reversal" operation (if ``True``).
    Some implementation of the ``QFTGate`` include a layer of swap gates at the end
    of the synthesized circuit, which can in principle be dropped if the ``QFTGate``
    itself is the last gate in the circuit.
* approximation_degree (int): The degree of approximation (0 for no approximation).
    It is possible to implement the QFT approximately by ignoring
    controlled-phase rotations with the angle beneath a threshold. This is discussed
    in more detail in [1] or [2].
* insert_barriers (bool): If True, barriers are inserted as visualization improvement.
* inverse (bool): If True, the inverse Fourier transform is constructed.
* name (str): The name of the circuit.

References:
    1. Adriano Barenco, Artur Ekert, Kalle-Antti Suominen, and Päivi Törmä,
       *Approximate Quantum Fourier Transform and Decoherence*,
       Physical Review A (1996).
       `arXiv:quant-ph/9601018 [quant-ph] <https://arxiv.org/abs/quant-ph/9601018>`_
    2. Donny Cheung,
       *Improved Bounds for the Approximate QFT* (2004),
       `arXiv:quant-ph/0403071 [quant-ph] <https://https://arxiv.org/abs/quant-ph/0403071>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given QFTGate.

## `QFTSynthesisLine`

```python
class QFTSynthesisLine(HighLevelSynthesisPlugin)
```

Synthesis plugin for QFT gates using linear connectivity.

This plugin name is :``qft.line`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

Note that the plugin mechanism is not applied if the gate is called ``qft`` but
is not an instance of ``QFTGate``. This allows users to create custom gates with
name ``qft``.

The plugin supports the following additional options:

* reverse_qubits (bool): Whether to synthesize the "QFT" operation (if ``False``,
    which is the default) or the "QFT-with-reversal" operation (if ``True``).
    Some implementation of the ``QFTGate`` include a layer of swap gates at the end
    of the synthesized circuit, which can in principle be dropped if the ``QFTGate``
    itself is the last gate in the circuit.
* approximation_degree (int): the degree of approximation (0 for no approximation).
    It is possible to implement the QFT approximately by ignoring
    controlled-phase rotations with the angle beneath a threshold. This is discussed
    in more detail in [1] or [2].

References:
    1. Adriano Barenco, Artur Ekert, Kalle-Antti Suominen, and Päivi Törmä,
       *Approximate Quantum Fourier Transform and Decoherence*,
       Physical Review A (1996).
       `arXiv:quant-ph/9601018 [quant-ph] <https://arxiv.org/abs/quant-ph/9601018>`_
    2. Donny Cheung,
       *Improved Bounds for the Approximate QFT* (2004),
       `arXiv:quant-ph/0403071 [quant-ph] <https://https://arxiv.org/abs/quant-ph/0403071>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given QFTGate.

## `TokenSwapperSynthesisPermutation`

```python
class TokenSwapperSynthesisPermutation(HighLevelSynthesisPlugin)
```

The permutation synthesis plugin based on the token swapper algorithm.

This plugin name is :``permutation.token_swapper`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

In more detail, this plugin is used to synthesize objects of type `PermutationGate`.
When synthesis succeeds, the plugin outputs a quantum circuit consisting only of swap
gates. When synthesis does not succeed, the plugin outputs `None`.

If either `coupling_map` or `qubits` is None, then the synthesized circuit
is not required to adhere to connectivity constraints, as is the case
when the synthesis is done before layout/routing.

On the other hand, if both `coupling_map` and `qubits` are specified, the synthesized
circuit is supposed to adhere to connectivity constraints. At the moment, the
plugin only creates swap gates between qubits in `qubits`, i.e. it does not use
any other qubits in the coupling map (if such synthesis is not possible, the
plugin  outputs `None`).

The plugin supports the following plugin-specific options:

* trials: The number of trials for the token swapper to perform the mapping. The
  circuit with the smallest number of SWAPs is returned.
* seed: The argument to the token swapper specifying the seed for random trials.
* parallel_threshold: The argument to the token swapper specifying the number of nodes
  in the graph beyond which the algorithm will use parallel processing.

For more details on the token swapper algorithm, see to the paper:
`arXiv:1902.09102 <https://arxiv.org/abs/1902.09102>`__.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given Permutation.

## `MCXSynthesisNDirtyI15`

```python
class MCXSynthesisNDirtyI15(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the paper
by Iten et al. (2016).

See [1] for details.

This plugin name is :``mcx.n_dirty_i15`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k\ge 4` control qubits this synthesis
method requires :math:`k - 2` additional dirty auxiliary qubits. The synthesized
circuit consists of :math:`2 * k - 1` qubits and at most :math:`8 * k - 6` CX gates.
For :math:`k\le 3` explicit efficient circuits are used instead.

The plugin supports the following plugin-specific options:

* num_clean_ancillas: The number of clean auxiliary qubits available.
* num_dirty_ancillas: The number of dirty auxiliary qubits available.
* relative_phase: When set to ``True``, the method applies the optimized multi-controlled
  X gate up to a relative phase, in a way that, by lemma 8 of [1], the relative
  phases of the ``action part`` cancel out with the phases of the ``reset part``.
* action_only: when set to ``True``, the method applies only the ``action part``
  of lemma 8 of [1].

References:
    1. Iten et. al., *Quantum Circuits for Isometries*, Phys. Rev. A 93, 032318 (2016),
       `arXiv:1501.06911 <https://arxiv.org/abs/1501.06911>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesisNCleanM15`

```python
class MCXSynthesisNCleanM15(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the paper by
Maslov (2016).

See [1] for details.

This plugin name is :``mcx.n_clean_m15`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k\ge 3` control qubits this synthesis
method requires :math:`k - 2` additional clean auxiliary qubits. The synthesized
circuit consists of :math:`2 * k - 1` qubits and at most :math:`6 * k - 6` CX gates.

The plugin supports the following plugin-specific options:

* num_clean_ancillas: The number of clean auxiliary qubits available.

References:
    1. Maslov., Phys. Rev. A 93, 022311 (2016),
       `arXiv:1508.03273 <https://arxiv.org/pdf/1508.03273>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesis1CleanB95`

```python
class MCXSynthesis1CleanB95(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the paper by
Barenco et al. (1995).

See [1] for details.

This plugin name is :``mcx.1_clean_b95`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k\ge 5` control qubits this synthesis
method requires a single additional clean auxiliary qubit. The synthesized
circuit consists of :math:`k + 2` qubits and at most :math:`16 * k - 24` CX gates.

The plugin supports the following plugin-specific options:

* num_clean_ancillas: The number of clean auxiliary qubits available.

References:
    1. Barenco et. al., *Elementary gates for quantum computation*, Phys.Rev. A52 3457 (1995),
       `arXiv:quant-ph/9503016 <https://arxiv.org/abs/quant-ph/9503016>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesis2CleanKG24`

```python
class MCXSynthesis2CleanKG24(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the paper by Khattar and
Gidney (2024).

See [1] for details.

The plugin name is :``mcx.2_clean_kg24`` which can be used as the key on an :class:`~.HLSConfig`
object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k\ge 3` control qubits this synthesis method requires
:math:`2` additional clean ancillary qubits. The synthesized circuit consists of :math:`k + 3`
qubits and at most :math:`6 * k - 6` CX gates.

The plugin supports the following plugin-specific options:

* num_clean_ancillas: The number of clean ancillary qubits available.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesis2DirtyKG24`

```python
class MCXSynthesis2DirtyKG24(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the paper by Khattar and
Gidney (2024).

See [1] for details.

The plugin name is :``mcx.2_dirty_kg24`` which can be used as the key on an :class:`~.HLSConfig`
object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k\ge 3` control qubits this synthesis method requires
:math:`2` additional dirty ancillary qubits. The synthesized circuit consists of :math:`k + 3`
qubits and at most :math:`12 * k - 18` CX gates.

The plugin supports the following plugin-specific options:

* num_clean_ancillas: The number of clean ancillary qubits available.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesis1CleanKG24`

```python
class MCXSynthesis1CleanKG24(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the paper by Khattar and
Gidney (2024).

See [1] for details.

The plugin name is :``mcx.1_clean_kg24`` which can be used as the key on an :class:`~.HLSConfig`
object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k\ge 3` control qubits this synthesis method requires
:math:`1` additional clean ancillary qubit. The synthesized circuit consists of :math:`k + 2`
qubits and at most :math:`6 * k - 6` CX gates.

The plugin supports the following plugin-specific options:

* num_clean_ancillas: The number of clean ancillary qubits available.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesis1DirtyKG24`

```python
class MCXSynthesis1DirtyKG24(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the paper by Khattar and
Gidney (2024).

See [1] for details.

The plugin name is :``mcx.1_dirty_kg24`` which can be used as the key on an :class:`~.HLSConfig`
object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k\ge 3` control qubits this synthesis method requires
:math:`1` additional dirty ancillary qubit. The synthesized circuit consists of :math:`k + 2`
qubits and at most :math:`12 * k - 18` CX gates.

The plugin supports the following plugin-specific options:

* num_clean_ancillas: The number of clean ancillary qubits available.

References:
    1. Khattar and Gidney, Rise of conditionally clean ancillae for optimizing quantum circuits
    `arXiv:2407.17966 <https://arxiv.org/abs/2407.17966>`__

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesisGrayCode`

```python
class MCXSynthesisGrayCode(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the Gray code.

This plugin name is :``mcx.gray_code`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k` control qubits this synthesis
method requires no additional clean auxiliary qubits. The synthesized
circuit consists of :math:`k + 1` qubits.

It is not recommended to use this method for large values of :math:`k + 1`
as it produces exponentially many gates.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesisNoAuxV24`

```python
class MCXSynthesisNoAuxV24(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the
implementation for MCPhaseGate, which is in turn based on the
paper by Vale et al. (2024).

See [1] for details.

This plugin name is :``mcx.noaux_v24`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k` control qubits this synthesis
method requires no additional clean auxiliary qubits. The synthesized
circuit consists of :math:`k + 1` qubits. The number of CX-gates is quadratic in
:math:`k`.

References:
    1. Vale et. al., *Circuit Decomposition of Multicontrolled Special Unitary
       Single-Qubit Gates*, IEEE TCAD 43(3) (2024),
       `arXiv:2302.06377 <https://arxiv.org/abs/2302.06377>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesisNoAuxHP24`

```python
class MCXSynthesisNoAuxHP24(HighLevelSynthesisPlugin)
```

Synthesis plugin for a multi-controlled X gate based on the
paper by Huang and Palsberg.

See [1] for details.

This plugin name is :``mcx.noaux_hp24`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For a multi-controlled X gate with :math:`k` control qubits this synthesis
method requires no additional clean auxiliary qubits. The synthesized
circuit consists of :math:`k + 1` qubits. The number of CX-gates is linear in
:math:`k`.

References:
    1. Huang and Palsberg, *Compiling Conditional Quantum Gates without Using
       Helper Qubits*, PLDI (2024),
       <https://dl.acm.org/doi/10.1145/3656436>`_

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCXSynthesisDefault`

```python
class MCXSynthesisDefault(HighLevelSynthesisPlugin)
```

The default synthesis plugin for a multi-controlled X gate.

This plugin name is :``mcx.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.


The plugin supports the following plugin-specific options:

* ``optimization_metric``: The optimization metric, indicating the property
  of the output circuit (e.g., the 2-qubit gate count or the T-count) that should
  be minimized. See :class:`.OptimizationMetric`.
* ``num_clean_ancillas``: The number of clean ancillary qubits available.
* ``num_dirty_ancillas``: The number of dirty ancillary qubits available.

### `run`

```python
def run(self, high_level_object, coupling_map=None, target=None, qubits=None, **options)
```

Run synthesis for the given MCX gate.

## `MCMTSynthesisDefault`

```python
class MCMTSynthesisDefault(HighLevelSynthesisPlugin)
```

A default decomposition for MCMT gates.

## `MCMTSynthesisNoAux`

```python
class MCMTSynthesisNoAux(HighLevelSynthesisPlugin)
```

A V-chain based synthesis for ``MCMTGate``.

## `MCMTSynthesisVChain`

```python
class MCMTSynthesisVChain(HighLevelSynthesisPlugin)
```

A V-chain based synthesis for ``MCMTGate``.

## `MCMTSynthesisXGate`

```python
class MCMTSynthesisXGate(HighLevelSynthesisPlugin)
```

A synthesis for ``MCMTGate`` with X gate as the base gate.

## `IntComparatorSynthesisDefault`

```python
class IntComparatorSynthesisDefault(HighLevelSynthesisPlugin)
```

The default synthesis for ``IntegerComparatorGate``.

Currently this is only supporting an ancilla-based decomposition.

## `IntComparatorSynthesisNoAux`

```python
class IntComparatorSynthesisNoAux(HighLevelSynthesisPlugin)
```

A potentially exponentially expensive comparison w/o auxiliary qubits.

## `IntComparatorSynthesis2s`

```python
class IntComparatorSynthesis2s(HighLevelSynthesisPlugin)
```

An integer comparison based on 2s complement.

## `ModularAdderSynthesisDefault`

```python
class ModularAdderSynthesisDefault(HighLevelSynthesisPlugin)
```

The default modular adder (no carry in, no carry out qubit) synthesis.

This plugin name is:``ModularAdder.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

The plugin supports the following plugin-specific options:

* ``optimization_metric``: The optimization metric, indicating the property
  of the output circuit (e.g., the 2-qubit gate count or the T-count) that should
  be minimized. See :class:`.OptimizationMetric`.
* ``num_clean_ancillas``: The number of clean ancillary qubits available.
* ``num_dirty_ancillas``: The number of dirty ancillary qubits available.

## `ModularAdderSynthesisV17`

```python
class ModularAdderSynthesisV17(HighLevelSynthesisPlugin)
```

A modular adder (modulo :math:`2^n`) without any ancillary qubits.

The plugin name is :``ModularAdder.v17`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

This plugin requires no auxiliary qubits.

## `ModularAdderSynthesisC04`

```python
class ModularAdderSynthesisC04(HighLevelSynthesisPlugin)
```

A ripple-carry adder, modulo :math:`2^n`.

This plugin name is:``ModularAdder.ripple_c04`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

This plugin requires at least one clean auxiliary qubit.

The plugin supports the following plugin-specific options:

* ``num_clean_ancillas``: The number of clean auxiliary qubits available.

## `ModularAdderSynthesisV95`

```python
class ModularAdderSynthesisV95(HighLevelSynthesisPlugin)
```

A ripple-carry adder, modulo :math:`2^n`.

This plugin name is:``ModularAdder.ripple_v95`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For an adder on 2 registers with :math:`n` qubits each, this plugin requires at
least :math:`n-1` clean auxiliary qubit.

The plugin supports the following plugin-specific options:

* ``num_clean_ancillas``: The number of clean auxiliary qubits available.

## `ModularAdderSynthesisD00`

```python
class ModularAdderSynthesisD00(HighLevelSynthesisPlugin)
```

A QFT-based adder, modulo :math:`2^n`.

This plugin name is:``ModularAdder.qft_d00`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `HalfAdderSynthesisDefault`

```python
class HalfAdderSynthesisDefault(HighLevelSynthesisPlugin)
```

The default half-adder (no carry in, but a carry out qubit) synthesis.

If we have an auxiliary qubit available, the Cuccaro ripple-carry adder uses
:math:`O(n)` CX gates and 1 auxiliary qubit, whereas the Vedral ripple-carry uses more CX
and :math:`n-1` auxiliary qubits. The QFT-based adder uses no auxiliary qubits, but
:math:`O(n^2)`, hence it is only used if no auxiliary qubits are available.

This plugin name is:``HalfAdder.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

If at least one clean auxiliary qubit is available, the :class:`HalfAdderSynthesisC04`
is used, otherwise :class:`HalfAdderSynthesisD00`.

The plugin supports the following plugin-specific options:

* ``num_clean_ancillas``: The number of clean auxiliary qubits available.

## `HalfAdderSynthesisC04`

```python
class HalfAdderSynthesisC04(HighLevelSynthesisPlugin)
```

A ripple-carry adder with a carry-out bit.

This plugin name is:``HalfAdder.ripple_c04`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

This plugin requires at least one clean auxiliary qubit.

The plugin supports the following plugin-specific options:

* ``num_clean_ancillas``: The number of clean auxiliary qubits available.

## `HalfAdderSynthesisV95`

```python
class HalfAdderSynthesisV95(HighLevelSynthesisPlugin)
```

A ripple-carry adder with a carry-out bit.

This plugin name is:``HalfAdder.ripple_v95`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For an adder on 2 registers with :math:`n` qubits each, this plugin requires at
least :math:`n-1` clean auxiliary qubit.

The plugin supports the following plugin-specific options:

* ``num_clean_ancillas``: The number of clean auxiliary qubits available.

## `HalfAdderSynthesisR25`

```python
class HalfAdderSynthesisR25(HighLevelSynthesisPlugin)
```

A ripple-carry adder with a carry-out bit with no ancillary qubits.

This plugin name is:``HalfAdder.ripple_r25`` which can be used as the key on an
:class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `HalfAdderSynthesisD00`

```python
class HalfAdderSynthesisD00(HighLevelSynthesisPlugin)
```

A QFT-based adder with a carry-in and a carry-out bit.

This plugin name is:``HalfAdder.qft_d00`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `FullAdderSynthesisDefault`

```python
class FullAdderSynthesisDefault(HighLevelSynthesisPlugin)
```

A ripple-carry adder with a carry-in and a carry-out bit.

This plugin name is:``FullAdder.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `FullAdderSynthesisC04`

```python
class FullAdderSynthesisC04(HighLevelSynthesisPlugin)
```

A ripple-carry adder with a carry-in and a carry-out bit.

This plugin name is:``FullAdder.ripple_c04`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

This plugin requires no auxiliary qubits.

## `FullAdderSynthesisV95`

```python
class FullAdderSynthesisV95(HighLevelSynthesisPlugin)
```

A ripple-carry adder with a carry-in and a carry-out bit.

This plugin name is:``FullAdder.ripple_v95`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

For an adder on 2 registers with :math:`n` qubits each, this plugin requires at
least :math:`n-1` clean auxiliary qubits.

The plugin supports the following plugin-specific options:

* ``num_clean_ancillas``: The number of clean auxiliary qubits available.

## `MultiplierSynthesisH18`

```python
class MultiplierSynthesisH18(HighLevelSynthesisPlugin)
```

A cumulative multiplier based on controlled adders.

This plugin name is:``Multiplier.cumulative_h18`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `MultiplierSynthesisR17`

```python
class MultiplierSynthesisR17(HighLevelSynthesisPlugin)
```

A QFT-based multiplier.

This plugin name is:``Multiplier.qft_r17`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `MultiplierSynthesisDefault`

```python
class MultiplierSynthesisDefault(HighLevelSynthesisPlugin)
```

THe default multiplier plugin.

This plugin name is:``Multiplier.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `PauliEvolutionSynthesisDefault`

```python
class PauliEvolutionSynthesisDefault(HighLevelSynthesisPlugin)
```

Synthesize a :class:`.PauliEvolutionGate` using the default synthesis algorithm.

This plugin name is:``PauliEvolution.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

The following plugin option can be set:

* preserve_order: If ``False``, allow re-ordering the Pauli terms in the Hamiltonian to
    reduce the circuit depth of the decomposition.

## `PauliEvolutionSynthesisRustiq`

```python
class PauliEvolutionSynthesisRustiq(HighLevelSynthesisPlugin)
```

Synthesize a :class:`.PauliEvolutionGate` using Rustiq.

This plugin name is :``PauliEvolution.rustiq`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

The Rustiq synthesis algorithm is described in [1], and is implemented in
Rust-based quantum circuit synthesis library available at
https://github.com/smartiel/rustiq-core.

On large circuits the plugin may take a significant runtime.

The plugin supports the following additional options:

* optimize_count (bool): if `True` the synthesis algorithm will try to optimize
    the 2-qubit gate count; and if `False` then the 2-qubit depth.
* preserve_order (bool): whether the order of paulis should be preserved, up to
    commutativity.
* upto_clifford (bool): if `True`, the final Clifford operator is not synthesized.
* upto_phase (bool): if `True`, the global phase of the returned circuit may
    differ from the global phase of the given pauli network.
* resynth_clifford_method (int): describes the strategy to synthesize the final
    Clifford operator. Allowed values are `0` (naive approach), `1` (qiskit
    greedy synthesis), `2` (rustiq isometry synthesis).

References:
    1. Timothée Goubault de Brugière and Simon Martiel,
       *Faster and shorter synthesis of Hamiltonian simulation circuits*,
       `arXiv:2404.03280 [quant-ph] <https://arxiv.org/abs/2404.03280>`_

## `AnnotatedSynthesisDefault`

```python
class AnnotatedSynthesisDefault(HighLevelSynthesisPlugin)
```

Synthesize an :class:`.AnnotatedOperation` using the default synthesis algorithm.

This plugin name is:``annotated.default`` which can be used as the key on
an :class:`~.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

## `WeightedSumSynthesisDefault`

```python
class WeightedSumSynthesisDefault(HighLevelSynthesisPlugin)
```

Synthesize a :class:`.WeightedSumGate` using the default synthesis algorithm.

This plugin name is:``WeightedSum.default`` which can be used as the key on
an :class:`.HLSConfig` object to use this method with :class:`~.HighLevelSynthesis`.

.. note::

    This default plugin requires auxiliary qubits. There is currently no implementation
    available without auxiliary qubits.
