// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Gate} from "src/circuit/Gate.js"
import {ketArgs, ketShaderPhase} from "src/circuit/KetShaderUtil.js"
import {WglArg} from "src/webgl/WglArg.js"
import {WglConfiguredShader} from "src/webgl/WglConfiguredShader.js"

const PHASE_GRADIENT_SHADER = ketShaderPhase(
    'uniform float factor;',
    `
        float angle = out_id * factor;
        return vec2(cos(angle), sin(angle));
    `);

let PhaseGradientGates = {};

PhaseGradientGates.PhaseGradientFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId("PhaseGradient" + span).
    setSymbol("e^iπ%").
    setTitle("Phase Gradient Gate").
    setBlurb("Phases by an amount proportional to the target value.").
    setActualEffectToShaderProvider(ctx => PHASE_GRADIENT_SHADER.withArgs(
        ...ketArgs(ctx, span),
        WglArg.float("factor", Math.PI / (1 << span)))).
    setKnownEffectToPhaser(k => k / (2 << span)));

PhaseGradientGates.PhaseDegradientFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId("PhaseUngradient" + span).
    setSymbol("e^-iπ%").
    setTitle("Inverse Phase Gradient Gate").
    setBlurb("Counter-phases by an amount proportional to the target value.").
    setActualEffectToShaderProvider(ctx => PHASE_GRADIENT_SHADER.withArgs(
        ...ketArgs(ctx, span),
        WglArg.float("factor", -Math.PI / (1 << span)))).
    setKnownEffectToPhaser(k => -k / (2 << span)));

PhaseGradientGates.all = [
    ...PhaseGradientGates.PhaseGradientFamily.all,
    ...PhaseGradientGates.PhaseDegradientFamily.all,
];

export {PhaseGradientGates, PHASE_GRADIENT_SHADER}
