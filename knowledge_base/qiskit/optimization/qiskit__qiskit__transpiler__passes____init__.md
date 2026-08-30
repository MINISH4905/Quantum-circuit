---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/__init__.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/__init__.py`

===================================================
Transpiler Passes (:mod:`qiskit.transpiler.passes`)
===================================================

.. currentmodule:: qiskit.transpiler.passes

Layout Selection (Placement)
============================

.. autosummary::
   :toctree: ../stubs/

   SetLayout
   TrivialLayout
   DenseLayout
   SabreLayout
   CSPLayout
   VF2Layout
   ApplyLayout
   Layout2qDistance
   EnlargeWithAncilla
   FullAncillaAllocation
   SabrePreLayout

Routing
=======

.. autosummary::
   :toctree: ../stubs/

   BasicSwap
   Commuting2qGateRouter
   LayoutTransformation
   LookaheadSwap
   SabreSwap
   StarPreRouting

Basis Change
============

.. autosummary::
   :toctree: ../stubs/

   BasisTranslator
   Decompose
   TranslateParameterizedGates
   Unroll3qOrMore
   UnrollCustomDefinitions

Optimizations
=============

.. autosummary::
   :toctree: ../stubs/

   Collect1qRuns
   Collect2qBlocks
   CollectAndCollapse
   CollectCliffords
   CollectLinearFunctions
   CollectMultiQBlocks
   CommutationAnalysis
   CommutativeCancellation
   CommutativeInverseCancellation
   CommutativeOptimization
   ConsolidateBlocks
   ContractIdleWiresInControlFlow
   ConvertToPauliRotations
   ElidePermutations
   HoareOptimizer
   InverseCancellation
   LightCone
   LitinskiTransformation
   Optimize1qGates
   Optimize1qGatesDecomposition
   Optimize1qGatesSimpleCommutation
   OptimizeAnnotated
   OptimizeCliffordT
   OptimizeCliffords
   OptimizeSwapBeforeMeasure
   RemoveDiagonalGatesBeforeMeasure
   RemoveFinalReset
   RemoveIdentityEquivalent
   RemoveResetInZeroState
   ResetAfterMeasureSimplification
   Split2QUnitaries
   SubstitutePi4Rotations
   TemplateOptimization
   TwoQubitPeepholeOptimization

Scheduling
=============

.. autosummary::
   :toctree: ../stubs/

   ALAPScheduleAnalysis
   ASAPScheduleAnalysis
   ConstrainedReschedule
   ContextAwareDynamicalDecoupling
   InstructionDurationCheck
   PadDelay
   PadDynamicalDecoupling
   SetIOLatency
   TimeUnitConversion

Circuit Analysis
================

.. autosummary::
   :toctree: ../stubs/

   CountOps
   CountOpsLongestPath
   DAGLongestPath
   Depth
   NumTensorFactors
   ResourceEstimation
   Size
   Width

Synthesis
=========

The synthesis transpiler plugin documentation can be found in the
:mod:`qiskit.transpiler.passes.synthesis.plugin` page.

.. autosummary::
   :toctree: ../stubs/

   HLSConfig
   HighLevelSynthesis
   LinearFunctionsToPermutations
   SolovayKitaev
   SynthesizeRZRotations
   UnitarySynthesis

Post Layout
===========

These are post qubit selection.

.. autosummary::
   :toctree: ../stubs/

   VF2PostLayout

Additional Passes
=================

.. autosummary::
   :toctree: ../stubs/

   BarrierBeforeFinalMeasurements
   CheckGateDirection
   CheckMap
   ContainsInstruction
   DAGFixedPoint
   Error
   FilterOpNodes
   FixedPoint
   GateDirection
   GatesInBasis
   MergeAdjacentBarriers
   MinimumPoint
   RemoveBarriers
   RemoveFinalMeasurements
   UnrollForLoops
   WrapAngles

Additional data
===============

.. py:data:: qiskit.transpiler.passes.utils.wrap_angles.WRAP_ANGLE_REGISTRY

    A legacy location for :attr:`.WrapAngles.DEFAULT_REGISTRY`.  This path should only be used when
    full compatibility with Qiskit 2.2 is required.
