// Reading Case — open LLM research shelf.
// Each paper carries: arXiv id, year, title, authors, tags, abstract, reading note, and a 3-step reading path.
// Ordered chronologically inside each page; the App component paginates 8 papers per page.

export const PAGE_SIZE = 8

export const papers = [
  // ───────────────────────────── Page 1 · Foundations & Early Open Models ─────────────────────────────
  {
    id: 'attention',
    code: '1706.03762',
    year: '2017',
    title: 'Attention Is All You Need',
    authors: 'Vaswani et al.',
    tags: ['architecture', 'foundational'],
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. This paper proposes a simpler architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    note: 'Replace the memory of a sequence with a map of relationships. The model reads every token in relation to the others.',
    path: [
      ['Self-attention', 'lets each token select what matters in the rest of the sequence.'],
      ['Multiple heads', 'preserve several kinds of relationships at the same time.'],
      ['Position signals', 'supply the order that recurrence once carried.'],
    ],
  },
  {
    id: 'rope',
    code: '2104.09864',
    year: '2021',
    title: 'RoFormer: Enhanced Transformer with Rotary Position Embedding',
    authors: 'Su et al.',
    tags: ['positional encoding', 'architecture'],
    abstract: 'Rotary Position Embedding (RoPE) encodes absolute position with a rotation matrix and incorporates explicit relative position dependency in self-attention. RoPE yields promising results on a wide range of long-sequence language tasks.',
    note: 'Positions become angles on a clock face. The model measures the angle between tokens instead of counting how far apart they are.',
    path: [
      ['Rotation matrices', 'mix position into the query–key dot product without adding new parameters.'],
      ['Relative distance', 'falls out of angle differences, so length generalization becomes a property of the geometry.'],
      ['Adopted everywhere', 'becomes the default for LLaMA, Mistral, Qwen, DeepSeek, and most modern open models.'],
    ],
  },
  {
    id: 'lora',
    code: '2106.09685',
    year: '2021',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: 'Hu et al.',
    tags: ['fine-tuning', 'efficiency'],
    abstract: 'An efficient adaptation strategy that introduces low-rank trainable matrices into each Transformer layer while keeping the pre-trained weights frozen. LoRA reduces the number of trainable parameters by orders of magnitude.',
    note: 'Adaptation is a thin correction on top of a frozen giant. Most of the model stays still; only a small slip of paper moves.',
    path: [
      ['Frozen base', 'keeps the original weights intact so a single base model can serve many tasks.'],
      ['Low-rank updates', 'bottleneck two tiny matrices whose product reshapes the layer’s behaviour.'],
      ['Mergeable', 'after training, the update can be folded back into the weights with no extra inference cost.'],
    ],
  },
  {
    id: 'flash-attention',
    code: '2205.14135',
    year: '2022',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: 'Dao et al.',
    tags: ['kernel', 'efficiency'],
    abstract: 'A new attention algorithm that computes exact attention with fewer memory accesses by tiling and recomputation. It is 2–4× faster than existing implementations and enables longer context in the same memory budget.',
    note: 'Speed is rarely about doing less work; it is about doing the work in the order memory actually wants.',
    path: [
      ['Tiling', 'keeps the working set inside fast on-chip memory instead of round-tripping to HBM.'],
      ['Recomputation', 'trades extra FLOPs for not storing every intermediate attention matrix.'],
      ['Long context', 'makes 32k and 100k+ token windows practical on consumer GPUs.'],
    ],
  },
  {
    id: 'gpt-neox',
    code: '2204.06745',
    year: '2022',
    title: 'GPT-NeoX-20B: An Open-Source Autoregressive Language Model',
    authors: 'Black et al.',
    tags: ['open weights', 'training'],
    abstract: 'GPT-NeoX-20B, a 20-billion parameter autoregressive language model trained on the Pile, is released under the Apache 2.0 license. The paper documents the model architecture, training infrastructure, and evaluation.',
    note: 'A proof that a serious dense model could be trained and shared without a hyperscaler’s budget. The first domino for the modern open-weights wave.',
    path: [
      ['Parallel attention + MLP', 'separates the two streams to overlap their work on the GPU.'],
      ['Rotary embeddings', 'foreshadows the encoding most open models would later adopt.'],
      ['Open release', 'puts a 20B model on the table for the community to inspect and fork.'],
    ],
  },
  {
    id: 'llama',
    code: '2302.13971',
    year: '2023',
    title: 'LLaMA: Open and Efficient Foundation Language Models',
    authors: 'Touvron et al.',
    tags: ['open weights', 'foundation'],
    abstract: 'We introduce LLaMA, a collection of foundation language models ranging from 7B to 65B parameters. The models are trained on publicly available datasets and show that smaller, well-trained models can be highly competitive.',
    note: 'Scale is not only a question of parameter count. The quality and curation of the training mixture changes what a small model can become.',
    path: [
      ['Public training data', 'moves a capable family of models into a reproducible research conversation.'],
      ['Token budget', 'shows why more compute can sometimes outperform a larger parameter count.'],
      ['Model family', 'turns one training recipe into several practical deployment sizes.'],
    ],
  },
  {
    id: 'mistral',
    code: '2310.06825',
    year: '2023',
    title: 'Mistral 7B',
    authors: 'Jiang et al.',
    tags: ['efficiency', 'open weights'],
    abstract: 'Mistral 7B is a language model with 7.3 billion parameters that outperforms larger models across several benchmarks. Grouped-query attention and sliding-window attention make the architecture efficient at inference time.',
    note: 'This is an efficiency paper with a product instinct: spend memory where readers of the context actually need it, not everywhere at once.',
    path: [
      ['Sliding windows', 'keep long contexts tractable by localizing most attention work.'],
      ['Grouped queries', 'share key-value heads to reduce the inference-memory burden.'],
      ['Benchmark framing', 'compares capability against the cost of making it available.'],
    ],
  },
  {
    id: 'qlora',
    code: '2305.14314',
    year: '2023',
    title: 'QLoRA: Efficient Finetuning of Quantized LLMs',
    authors: 'Dettmers et al.',
    tags: ['fine-tuning', 'quantization'],
    abstract: 'QLoRA backpropagates gradients through a frozen 4-bit quantized model into low-rank adapters. It matches 16-bit fine-tuning quality while reducing memory enough to finetune a 65B model on a single 48GB GPU.',
    note: 'Quantization is usually a one-way door: you gain speed but lose the ability to learn. QLoRA keeps both doors open at once.',
    path: [
      ['4-bit NormalFloat', 'a new data type matched to the bell shape of trained weights.'],
      ['Double quant + paging', 'squeezes the optimizer state and out-of-core memory swaps.'],
      ['Adapter on top', 'LoRA-style low-rank updates do the actual learning.'],
    ],
  },

  // ───────────────────────────── Page 2 · Alignment, MoE & Chinese Open Models ─────────────────────────────
  {
    id: 'dpo',
    code: '2305.18290',
    year: '2023',
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    authors: 'Rafailov et al.',
    tags: ['alignment', 'training'],
    abstract: 'DPO reparameterizes the RLHF objective so a policy can be optimized directly from preference data, without sampling from a reward model or running PPO. It is stable, lightweight, and matches or exceeds PPO on instruction following.',
    note: 'Two long detours through reinforcement learning collapsed into a single supervised loss. Most of the heavy machinery was scaffolding.',
    path: [
      ['Implicit reward', 'the optimal policy is its own reward model when written in the right variables.'],
      ['Reference-free loss', 'drops the moving target that made PPO unstable.'],
      ['Cheap to run', 'turns alignment into a normal training run on preference pairs.'],
    ],
  },
  {
    id: 'mixtral',
    code: '2401.04088',
    year: '2024',
    title: 'Mixtral 8x7B: Sparse Mixture of Experts from Mistral',
    authors: 'Jiang et al.',
    tags: ['mixture of experts', 'open weights'],
    abstract: 'Mixtral 8x7B is a sparse mixture-of-experts model with 8 experts per layer, activating two per token. It matches or beats LLaMA 2 70B across benchmarks while using a fraction of the active compute per token.',
    note: 'Capacity grows, but the work per token does not. The model gets bigger only on the days you ask it to.',
    path: [
      ['Top-2 routing', 'each token picks the two experts most likely to help it.'],
      ['Active budget', 'compute per token stays close to a 13B-class dense model.'],
      ['Apache 2.0 release', 'the first credible open MoE at frontier-class quality.'],
    ],
  },
  {
    id: 'deepseek-moe',
    code: '2401.02954',
    year: '2024',
    title: 'DeepSeekMoE: Towards Ultimate Expert Specialization',
    authors: 'Dai et al.',
    tags: ['mixture of experts', 'routing'],
    abstract: 'DeepSeekMoE introduces finer-grained expert segmentation and shared experts to improve specialization in mixture-of-experts language models. The approach increases capacity while keeping computation per token controlled.',
    note: 'A mixture-of-experts model is a library with many rooms. The routing policy decides which rooms deserve to stay lit for each question.',
    path: [
      ['Fine-grained experts', 'break broad capabilities into smaller, more distinct computational roles.'],
      ['Shared experts', 'keep common knowledge available without making every route duplicate it.'],
      ['Sparse activation', 'grows total capacity while preserving a bounded cost per token.'],
    ],
  },
  {
    id: 'gqa',
    code: '2305.13245',
    year: '2023',
    title: 'GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints',
    authors: 'Ainslie et al.',
    tags: ['inference', 'architecture'],
    abstract: 'GQA groups query heads so they share key–value heads, interpolating between multi-head and multi-query attention. It recovers most of multi-query’s speed with multi-head’s quality, and can be obtained by uptraining an existing MHA checkpoint.',
    note: 'Cache once, ask many questions. Most of the cost of attention lives in keys and values; sharing them is almost free.',
    path: [
      ['Shared K/V', 'all queries in a group look at the same small set of keys and values.'],
      ['Uptraining', 'a regular MHA checkpoint is converted with only a small slice of extra training.'],
      ['Adopted by Llama 2/3', 'becomes the default for serious open-weights models.'],
    ],
  },
  {
    id: 'llama-2',
    code: '2307.09288',
    year: '2023',
    title: 'Llama 2: Open Foundation and Fine-Tuned Chat Models',
    authors: 'Touvron et al.',
    tags: ['open weights', 'chat'],
    abstract: 'Llama 2 releases a family of pretrained and chat-tuned models up to 70B. The paper covers training recipes, RLHF details, and safety evaluations, and grants commercial use for products under 700M monthly users.',
    note: 'A 70B chat model with a real license. The moment a startup could plan a product around an open model without lawyers getting in the way.',
    path: [
      ['GQA + longer context', '4k context and grouped-query attention make the 70B practical.'],
      ['RLHF with two reward models', 'separates helpfulness and safety so they do not pull the model apart.'],
      ['Commercial license', 'turns the model into something a roadmap can depend on.'],
    ],
  },
  {
    id: 'code-llama',
    code: '2308.12950',
    year: '2023',
    title: 'Code Llama: Open Foundation Models for Code',
    authors: 'Roziere et al.',
    tags: ['code', 'open weights'],
    abstract: 'Code Llama is a family of code-specialized Llama 2 models released in 7B, 13B, 34B and three flavors (base, Python, instruct). It achieves state-of-the-art performance among open models on common coding benchmarks.',
    note: 'Domain expertise is mostly the same model with a different reading list. The architecture barely changes; the data changes everything.',
    path: [
      ['Continued pretraining', 'heavy exposure to code corpora and infilling-style data.'],
      ['Long context', 'up to 100k tokens for understanding whole repositories.'],
      ['Self-instruct', 'synthetic instruction data teaches it to act like a coding assistant.'],
    ],
  },
  {
    id: 'baichuan-2',
    code: '2309.10305',
    year: '2023',
    title: 'Baichuan 2: Open Large-scale Language Models',
    authors: 'Yang et al.',
    tags: ['open weights', 'foundation'],
    abstract: 'Baichuan 2 is a series of large multilingual language models trained on 2.6T tokens. Both 7B and 13B variants are released for commercial use, with detailed ablations on data, training, and safety.',
    note: 'A second strong Chinese open family, released while the conversation about open-weights was still being defined in English papers.',
    path: [
      ['Massive corpus', '2.6T tokens balanced between Chinese, English, multilingual and code.'],
      ['Commercial-friendly license', 'opens the door for direct product integration.'],
      ['Safety ablations', 'one of the first open models to publish concrete harm-reduction work.'],
    ],
  },
  {
    id: 'qwen',
    code: '2309.16609',
    year: '2023',
    title: 'Qwen Technical Report',
    authors: 'Bai et al.',
    tags: ['open weights', 'multilingual'],
    abstract: 'Qwen is a series of large language models including Qwen-7B and Qwen-7B-Chat, pretrained on 3T tokens spanning English, Chinese, and code. The report documents architecture, alignment, evaluations, and tokenizer design.',
    note: 'A tokenizer built for Chinese, English and code at once. The first hundred pages of any multilingual model are fought at the token level.',
    path: [
      ['Multilingual tokenizer', 'a 152k vocabulary that wastes few characters on either side.'],
      ['3T tokens', 'one of the larger open pretraining corpora at the time.'],
      ['Aligned chat model', 'a chat-tuned sibling released alongside the base.'],
    ],
  },

  // ───────────────────────────── Page 3 · 2024 · Open Models Hit Scale ─────────────────────────────
  {
    id: 'yi',
    code: '2403.04652',
    year: '2024',
    title: 'Yi: Open Foundation Models by 01.AI',
    authors: 'Young et al.',
    tags: ['open weights', 'bilingual'],
    abstract: 'Yi is a bilingual English–Chinese model family ranging from 6B to 34B. The report describes the data pipeline, evaluation methodology, and a 200k context length that the authors validate with a needle-in-a-haystack test.',
    note: 'A reminder that long context is not just a number. The test is whether the model can find one fact in a haystack of 200,000 tokens.',
    path: [
      ['Bilingual corpus', 'carefully balanced English and Chinese across the training mix.'],
      ['200k context', 'trained and verified to use the full window without forgetting the middle.'],
      ['Open release', 'both 6B and 34B checkpoints with permissive terms.'],
    ],
  },
  {
    id: 'llama-3',
    code: '2407.21783',
    year: '2024',
    title: 'The Llama 3 Herd of Models',
    authors: 'Dubey et al.',
    tags: ['open weights', 'foundation'],
    abstract: 'Llama 3 is a herd of multilingual foundation models in 8B, 70B and 405B sizes, pretrained on roughly 15.6T tokens. The report documents the data mix, post-training recipe, and a much stronger safety stack than Llama 2.',
    note: 'Openness stopped being a deficit. A 405B open-weights model that closes the gap to closed frontier became the new baseline for the field.',
    path: [
      ['15.6T tokens', 'a token budget that used to be reserved for closed labs.'],
      ['DPO + rejection sampling', 'replaces PPO with a simpler, more reproducible post-training recipe.'],
      ['405B flagship', 'the largest open-weights model of its generation, with full release notes.'],
    ],
  },
  {
    id: 'deepseek-v2',
    code: '2405.04434',
    year: '2024',
    title: 'DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model',
    authors: 'DeepSeek-AI',
    tags: ['mixture of experts', 'efficiency'],
    abstract: 'DeepSeek-V2 is a 236B-parameter MoE model activating only 21B per token. Multi-head Latent Attention cuts the KV cache, and strong multi-task training yields competitive performance at a fraction of inference cost.',
    note: 'The bill for inference does not have to scale with parameter count. Most parameters can be off most of the time, as long as the routing is fair.',
    path: [
      ['Multi-head Latent Attention', 'compresses the KV cache to a low-rank latent before storing it.'],
      ['236B / 21B active', 'capacity without the latency tax of dense models at the same total size.'],
      ['Strong open release', 'moved the bar for open MoE well past Mixtral.'],
    ],
  },
  {
    id: 'qwen2',
    code: '2407.10671',
    year: '2024',
    title: 'Qwen2 Technical Report',
    authors: 'Yang et al.',
    tags: ['open weights', 'multilingual'],
    abstract: 'Qwen2 is a family of multilingual models from 0.5B to 72B, with explicit ablations on tokenizer, training data, and long-context training. Qwen2-72B reaches frontier-class performance on multilingual benchmarks.',
    note: 'Scale, tokenizer, and a long-context recipe glued together. The second wave of Chinese open models arrived with much tighter training discipline.',
    path: [
      ['Tight tokenizer ablations', 'shows the careful cost of every vocabulary choice.'],
      ['Up to 128k context', 'long-context training with a focus on extrapolation.'],
      ['Multiple sizes', 'a model for every deployment size from a phone to a cluster.'],
    ],
  },
  {
    id: 'gemma-2',
    code: '2408.00118',
    year: '2024',
    title: 'Gemma 2: Improving Open Language Models at a Practical Size',
    authors: 'Team et al.',
    tags: ['open weights', 'distillation'],
    abstract: 'Gemma 2 (9B and 27B) reports that a strong open model at a moderate size can rival much larger ones by combining knowledge distillation, sliding attention, and a careful post-training recipe.',
    note: 'A 27B model matching a Llama 2 70B is a sign that the frontier has split into size and efficiency tracks.',
    path: [
      ['Logit distillation', 'a larger teacher is compressed into a smaller student without losing too much.'],
      ['Alternating local–global attention', 'keeps long context affordable by mixing window sizes.'],
      ['RLHF + DPO blend', 'a softer, more stable post-training regime than pure PPO.'],
    ],
  },
  {
    id: 'phi-3',
    code: '2404.14219',
    year: '2024',
    title: 'Phi-3 Technical Report: A Highly Capable Language Model Locally on Your Phone',
    authors: 'Abdin et al.',
    tags: ['small model', 'efficiency'],
    abstract: 'Phi-3-mini (3.8B) matches the quality of Mixtral 8x7B and GPT-3.5 on key benchmarks while being small enough to run on a phone. The report studies how data quality, not just scale, drives capability.',
    note: 'Most of what people called “model size” was really “amount of training effort”. Phi-3 shows that a small, careful data diet can compress a lot of that into a tiny footprint.',
    path: [
      ['Data curation', 'a heavily filtered “textbook-quality” corpus replaces raw scale.'],
      ['3.8B parameters', 'fits on a phone and still reads like a frontier model on most prompts.'],
      ['Open release', 'Phi-3-mini ships under MIT, accelerating on-device research.'],
    ],
  },
  {
    id: 'glm-4',
    code: '2406.12714',
    year: '2024',
    title: 'ChatGLM: A Family of Large Language Models from GLM-4 to GLM-4-AllTools',
    authors: 'GLM Team et al.',
    tags: ['open weights', 'agentic'],
    abstract: 'The ChatGLM report covers GLM-4, a multilingual chat model with tool use and long-context support, plus GLM-4-AllTools, an agentic variant. The model is benchmarked on English, Chinese, and tool-use evaluations.',
    note: 'Tool use as a first-class training signal, not a bolted-on wrapper. The agentic path is now part of pretraining, not post-hoc.',
    path: [
      ['Multilingual base', 'balanced English, Chinese, and code from the start.'],
      ['Native tool calling', 'trained to call functions as part of the same model that reads and writes.'],
      ['AllTools agentic variant', 'one model, several tool environments, evaluated end-to-end.'],
    ],
  },
  {
    id: 'internvl',
    code: '2312.14238',
    year: '2023',
    title: 'InternVL: Scaling up Vision Foundation Models and Aligning for Generic Visual–Linguistic Tasks',
    authors: 'Chen et al.',
    tags: ['multimodal', 'vision-language'],
    abstract: 'InternVL scales a vision encoder to 6B parameters and aligns it with an open LLM, achieving strong performance on dozens of vision–language benchmarks, including OCR, document understanding, and multimodal dialogue.',
    note: 'A vision tower can grow to meet a language model halfway. Once it is large enough, the rest of the model can be ordinary text.',
    path: [
      ['6B vision encoder', 'closes the gap to language-side parameter counts.'],
      ['QLoRA-style alignment', 'the LLM stays frozen while a small adapter learns the bridge.'],
      ['Broad evaluation', 'OCR, document, chart, dialogue — a real stress test, not a leaderboard screenshot.'],
    ],
  },

  // ───────────────────────────── Page 4 · Reasoning Models & the Latest Wave ─────────────────────────────
  {
    id: 'deepseek-v3',
    code: '2412.19437',
    year: '2024',
    title: 'DeepSeek-V3 Technical Report',
    authors: 'DeepSeek-AI',
    tags: ['mixture of experts', 'foundation'],
    abstract: 'DeepSeek-V3 is a 671B-parameter MoE model activating 37B per token, trained on 14.8T tokens. Multi-head Latent Attention, an auxiliary-loss-free balancing objective, and multi-token prediction make the training highly efficient.',
    sections: [
      {
        title: 'Abstract',
        body: 'DeepSeek-V3 is a 671B-parameter MoE model with 37B activated for each token. To achieve efficient inference and cost-effective training, it adopts Multi-head Latent Attention (MLA) and DeepSeekMoE architectures, which were thoroughly validated in DeepSeek-V2. DeepSeek-V3 pioneers an auxiliary-loss-free strategy for load balancing and sets a multi-token prediction training objective for stronger performance. It is pre-trained on 14.8T diverse and high-quality tokens, followed by SFT and RL stages. Comprehensive evaluations show it outperforms other open-source models and is competitive with leading closed-source models. The full training requires only 2.788M H800 GPU hours with no irrecoverable loss spikes and no rollbacks.',
      },
      {
        title: 'Architecture',
        body: 'DeepSeek-V3 keeps the DeepSeek-V2 backbone — Multi-head Latent Attention (MLA) for KV-cache compression, plus DeepSeekMoE for sparse expert routing — and adds two refinements.\n\nThe first is an auxiliary-loss-free load-balancing strategy. Instead of adding an extra balancing loss to the training objective, V3 keeps a running per-expert bias term that is dynamically updated based on whether each expert is over- or under-loaded. This preserves model quality while still routing tokens roughly evenly.\n\nThe second is Multi-Token Prediction (MTP): an additional training head that predicts the next two tokens using shared embedding and output projection. MTP densifies the training signal and serves as a built-in draft model for speculative decoding at inference time.',
      },
      {
        title: 'Training efficiency',
        body: 'Pre-training runs on 2048 H800 GPUs across 256 nodes with a hybrid 16-way pipeline parallel, 64-way expert parallel, and ZeRO-1 data parallel layout. The team introduces DualPipe, which overlaps forward and backward passes of adjacent micro-batches in a way that hides most of the pipeline bubble.\n\nCommunication is hidden inside compute: the MoE all-to-all sends are carefully pipelined with the expert GEMMs, and a token is allowed to land on at most 4 nodes so NVLink can saturate before the slower IB kicks in. The full pre-training consumed 2.664M H800 GPU hours, and the entire post-training pipeline (SFT + RL + R1-distillation) adds only 0.1M H800 hours on top.',
      },
      {
        title: 'FP8 mixed precision',
        body: 'For the first time at this scale, DeepSeek-V3 is trained end-to-end in FP8 mixed precision. The team refines the standard per-tensor scaling approach into a fine-grained blockwise scaling scheme for both weights and activations, and routes a portion of the FP32 accumulation through CUDA cores so the GEMM keeps enough precision to remain stable.\n\nThe result is that V3 ships in native FP8 weights, and BF16 versions can be derived losslessly for hardware that needs them — no retraining required.',
      },
      {
        title: 'Post-training: knowledge distillation from R1',
        body: 'For the chat model, DeepSeek distills reasoning ability from a long-CoT DeepSeek-R1 model into V3 by mixing R1-style verification and reflection patterns into the SFT data. The pipeline is lightweight: no PPO, no separate reward model — just curated reasoning traces that teach V3 to self-check.\n\nThis single technique delivers the bulk of V3\u2019s reasoning gains while keeping the model\u2019s output style and length within normal chat conventions.',
      },
      {
        title: 'Results',
        body: 'DeepSeek-V3 outperforms other open-source models on MMLU, BBH, HumanEval, MATH, and the standard chat benchmarks, and is competitive with closed frontier models including GPT-4o and Claude-3.5-Sonnet at release time. The team reports zero irrecoverable loss spikes and no rollbacks across the entire pre-training run.',
      },
      {
        title: 'Why it matters',
        body: 'DeepSeek-V3 is the first open MoE at this scale to ship without auxiliary balancing losses, the first to be trained end-to-end in FP8, and one of the first to demonstrate that a 671B MoE can be pre-trained in under 3M H800 hours. The combination — quality competitive with closed frontier, training cost orders of magnitude lower, and weights released — reset the cost curve for open-weights frontier models.',
      },
    ],
    note: 'The end of “MoE needs special tricks to be stable”. Auxiliary-loss-free balancing reads as a small change, but it changes the entire optimization story.',
    path: [
      ['671B / 37B active', 'capacity close to a frontier dense model at a fraction of the inference cost.'],
      ['Auxiliary-loss-free MoE', 'a bias term, not an extra loss, keeps experts balanced.'],
      ['Multi-token prediction', 'predicts more than one future token and helps both training and speculative decoding.'],
    ],
  },
  {
    id: 'deepseek-r1',
    code: '2501.12948',
    year: '2025',
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    authors: 'Guo et al.',
    tags: ['reasoning', 'reinforcement learning'],
    abstract: 'DeepSeek-R1 trains a reasoning model with pure large-scale RL on top of the V3 base, then distills the result into smaller dense models. R1-Distill-Qwen and R1-Distill-Llama reach o1-mini level performance at single-digit-billion sizes.',
    sections: [
      {
        title: 'Abstract',
        body: `General reasoning represents a long-standing and formidable challenge in AI. Recent breakthroughs, exemplified by LLMs and chain-of-thought prompting, have achieved considerable success on foundational reasoning tasks, but heavily depend on human-annotated demonstrations. This paper shows that the reasoning abilities of LLMs can be incentivized through pure reinforcement learning, without any human-labeled reasoning trajectories. The proposed RL framework facilitates the emergent development of advanced reasoning patterns such as self-reflection, verification, and dynamic strategy adaptation, and the trained model surpasses its counterparts trained via supervised learning on mathematics, coding, and STEM tasks.`,
      },
      {
        title: 'Method: GRPO',
        body: `DeepSeek-R1-Zero is trained with Group Relative Policy Optimization (GRPO): instead of training a separate value model, GRPO samples a group of rollouts for each prompt and uses the group's relative reward as the advantage. The reward signal is a simple rule-based score (correct vs incorrect) on math, code, and format — no reward model, no human preference data.

This is the move that made reasoning emerge from pure RL. With nothing but 'right answer / wrong answer' as feedback, the model spontaneously grew long chains of thought, self-correction, and aha moments.`,
      },
      {
        title: 'From R1-Zero to R1',
        body: `R1-Zero's outputs were usable but the language mixing and readability were poor. R1 keeps the same RL core but adds a small cold-start SFT pass on a few thousand high-quality long-CoT examples before the RL stage, then runs a second RL pass with a language-consistency reward. The result is a reasoning model that is both strong and pleasant to read.`,
      },
      {
        title: 'Distillation to small models',
        body: `The most surprising result: reasoning ability transfers cleanly via SFT distillation. DeepSeek collects 800K high-quality reasoning samples from R1 and fine-tunes Qwen and Llama checkpoints of various sizes on them. R1-Distill-Qwen-7B and R1-Distill-Llama-8B reach o1-mini level performance on math and code benchmarks, beating many larger open models.

This is what proved to the field that reasoning is a transferable behaviour, not a property of model size.`,
      },
      {
        title: 'Why it matters',
        body: `DeepSeek-R1 is the first open-weights reasoning model competitive with OpenAI's o1, and the first to show that pure RL (not RLHF or RLAIF) is enough to elicit long-CoT reasoning. Combined with R1's distillation results, the paper effectively redrew the open-weights reasoning landscape and seeded a wave of small distilled reasoners across the community.`,
      },
    ],
    note: 'Reasoning did not need a secret training trick. It needed a reward signal that said “think longer” and a model willing to listen.',
    path: [
      ['GRPO', 'group-relative policy optimization removes the need for a separate critic.'],
      ['Reasoning emerges', 'long chains of thought appear without any supervised reasoning data.'],
      ['Distillation pays off', 'small dense models inherit the reasoning behaviour of the big one.'],
    ],
  },
  {
    id: 'qwen3',
    code: '2505.09388',
    year: '2025',
    title: 'Qwen3 Technical Report',
    authors: 'Qwen Team',
    tags: ['open weights', 'reasoning'],
    abstract: 'Qwen3 is a family of dense and MoE models trained on 36T tokens with a unified thinking/non-thinking mode. The smallest 0.6B variant runs on low-end devices, while the 235B MoE flagship is competitive with frontier closed models.',
    sections: [
      {
        title: 'Abstract',
        body: `This work presents Qwen3, the latest version of the Qwen model family. Qwen3 includes both dense and Mixture-of-Expert (MoE) architectures, with parameter scales ranging from 0.6 to 235 billion. A key innovation is the integration of thinking mode (for complex, multi-step reasoning) and non-thinking mode (for rapid, context-driven responses) into a unified framework, eliminating the need to switch between different models. Qwen3 also introduces a thinking budget mechanism, allowing users to allocate computational resources adaptively during inference. Compared to Qwen2.5, Qwen3 expands multilingual support from 29 to 119 languages and dialects.`,
      },
      {
        title: 'Unified thinking + non-thinking',
        body: `Earlier reasoning models (QwQ, DeepSeek-R1) and chat models lived in separate model families. Qwen3 collapses both into one checkpoint: the same weights can either produce a long thinking trace or a fast direct answer, gated by a chat-template flag.

This removes the operational pain of picking the right model per query, and lets the same deployment serve both patterns.`,
      },
      {
        title: 'Thinking budget',
        body: `Qwen3 exposes a \`thinking_budget\` parameter that controls how many tokens the model is allowed to spend on internal reasoning before producing the visible answer. Setting it low keeps latency tight for simple queries; setting it high (or to 'max') spends more compute on hard problems.

This is the same idea behind Anthropic's adaptive thinking effort, now in an open-weights model.`,
      },
      {
        title: 'MoE flagship: 235B / 22B active',
        body: `The flagship Qwen3-235B is a sparse MoE with 235B total / 22B active parameters, scaling efficiency roughly 2× over Qwen2.5. The series also ships 0.6B, 1.7B, 4B, 8B, 14B, and 32B dense variants for on-device and edge deployment.

Knowledge distillation from the flagship is used to build the smaller models, so the 32B dense tracks the 235B MoE more closely than would be expected from a pure pretraining run.`,
      },
      {
        title: 'Why it matters',
        body: `Qwen3 is the first open-weights family to ship a unified thinking/non-thinking model at every size from 0.6B to 235B. The combination of 'one model for both modes', adaptive thinking budget, and 119-language coverage makes it the most deployment-friendly open-weights reasoning model of 2025 H1.`,
      },
    ],
    note: 'One model that knows when to think and when to answer. The cost of reasoning is paid only when the prompt asks for it.',
    path: [
      ['Thinking toggle', 'a single model that switches between fast and slow modes per request.'],
      ['36T tokens', 'a pretraining budget that reflects the new scale of the open conversation.'],
      ['235B / 22B MoE', 'frontier-class performance with bounded active compute.'],
    ],
  },
  {
    id: 'phi-4',
    code: '2412.08905',
    year: '2024',
    title: 'Phi-4 Technical Report',
    authors: 'Abdin et al.',
    tags: ['small model', 'reasoning'],
    abstract: 'Phi-4 is a 14B parameter model trained on a mix of synthetic and organic data. Strong performance on math and reasoning benchmarks is achieved with significantly more synthetic data than prior Phi models, including novel synthetic textbook content.',
    sections: [
      {
        title: 'Abstract',
        body: `We present phi-4, a 14-billion parameter language model developed with a training recipe that is centrally focused on data quality. Unlike most language models, where pre-training is based primarily on organic data sources, phi-4 strategically incorporates synthetic data throughout the training process. While previous Phi models largely distill the capabilities of a teacher model (GPT-4), phi-4 substantially surpasses its teacher model on STEM-focused QA capabilities, giving evidence that our data-generation and post-training techniques go beyond distillation. Despite minimal changes to the phi-3 architecture, phi-4 achieves strong performance relative to its size, especially on reasoning-focused benchmarks, due to improved data, training curriculum, and innovations in the post-training scheme.`,
      },
      {
        title: 'Synthetic-first training',
        body: `Phi-4's pretraining corpus is roughly half organic web / code and half carefully crafted synthetic data — synthetic textbooks, synthetic exercises, synthetic dialogues that the team wrote to teach specific reasoning skills. The seed data is small; the synthetic generators are themselves high-quality models that produce targeted, diversity-controlled examples.

This is what allows a 14B model to outperform GPT-4 on STEM QA, which the paper explicitly calls out as evidence that the recipe is not just distillation.`,
      },
      {
        title: 'Curriculum and post-training',
        body: `The training curriculum mixes organic and synthetic data in a sequence that ramps up reasoning difficulty over time. Post-training uses a mix of DPO and RLHF with a heavy emphasis on math and code, again leaning on synthetic preference data where ground-truth answers exist.

The architectural changes from phi-3 are minimal — the gains are almost entirely from data and curriculum design.`,
      },
      {
        title: 'Why it matters',
        body: `Phi-4 is the strongest evidence yet that small models with carefully designed synthetic data can punch far above their parameter count. The MIT-licensed 14B weights make it one of the most capable reasoning models that fits on a single consumer GPU.`,
      },
    ],
    note: 'Synthetic data is no longer a workaround for small models. With the right seeds, a 14B model can out-reason much larger ones on math.',
    path: [
      ['Synthetic-heavy mix', 'the bulk of the training data is generated and curated, not scraped.'],
      ['14B dense', 'small enough to deploy, large enough to reason.'],
      ['MIT release', 'weights, code, and recipe all in the open.'],
    ],
  },
  {
    id: 'openelm',
    code: '2404.14619',
    year: '2024',
    title: 'OpenELM: An Efficient Language Model Family with Open Training and Inference Framework',
    authors: 'Mehta et al.',
    tags: ['on-device', 'open training'],
    abstract: 'OpenELM is a 270M–1.1B parameter model family designed for on-device use. The paper emphasizes a fully open training pipeline, layer-wise scaling, and tight integration with Apple’s MLX framework.',
    sections: [
      {
        title: 'Abstract',
        body: `The reproducibility and transparency of large language models are crucial for advancing open research, ensuring the trustworthiness of results, and enabling investigations into data and model biases, as well as potential risks. To this end, we release OpenELM, a state-of-the-art open language model. OpenELM uses a layer-wise scaling strategy to efficiently allocate parameters within each layer of the transformer model, leading to enhanced accuracy. For example, with a parameter budget of approximately one billion parameters, OpenELM exhibits a 2.36% improvement in accuracy compared to OLMo while requiring 2× fewer pre-training tokens.`,
      },
      {
        title: 'Layer-wise scaling',
        body: `Standard transformers allocate the same hidden size and number of heads to every layer. OpenELM instead varies the width across depth: early layers are narrower, later layers are wider. The paper's analysis shows this simple change gives a better accuracy / parameter trade-off than uniform scaling, with no change to training recipe.

This is a useful reminder that 'transformer block' does not have to mean 'every block is identical'.`,
      },
      {
        title: 'Open training pipeline',
        body: `OpenELM is one of the first open-weights models where the full training pipeline is released, not just the final checkpoint: data filtering, tokenizer, training code, intermediate checkpoints, and training logs. The paper explicitly cites research reproducibility and bias investigation as the motivation.

For the on-device community this matters more than the model itself, because the recipe can be re-run.`,
      },
      {
        title: 'MLX-first inference',
        body: `The model ships with a custom Apple MLX implementation optimized for Apple silicon, not just a Hugging Face port. This is a deliberate bet that on-device LLM use on iPhone, iPad, and Mac will be a major deployment target.`,
      },
      {
        title: 'Why it matters',
        body: `OpenELM is not the strongest 1B model on benchmarks, but it is one of the most open, and it is the one Apple is willing to ship on-device. Together with the layer-wise scaling result, the paper pushed the open-weights community toward a more honest 'release the whole pipeline' standard.`,
      },
    ],
    note: 'Tiny models are a different product, not a smaller one. On-device means tradeoffs the cloud never has to make.',
    path: [
      ['Layer-wise scaling', 'allocates more parameters to deeper layers instead of widening every block equally.'],
      ['Open training code', 'the data prep and training scripts are released, not just the weights.'],
      ['MLX-first inference', 'optimized for Apple silicon as a first-class deployment target.'],
    ],
  },
  {
    id: 'llava',
    code: '2304.08485',
    year: '2023',
    title: 'Visual Instruction Tuning (LLaVA)',
    authors: 'Liu et al.',
    tags: ['multimodal', 'instruction tuning'],
    abstract: 'LLaVA connects a CLIP vision encoder to a Vicuna language model with a projection layer, then applies visual instruction tuning on synthetic image–instruction data. It reaches 92.53% on the ScienceQA benchmark, a new state of the art.',
    sections: [
      {
        title: 'Abstract',
        body: `Instruction tuning large language models (LLMs) using machine-generated instruction-following data has improved zero-shot capabilities on new tasks, but the idea is less explored in the multimodal field. In this paper, we present the first attempt to use language-only GPT-4 to generate multimodal language-image instruction-following data. By instruction tuning on such generated data, we introduce LLaVA: Large Language and Vision Assistant, an end-to-end trained large multimodal model that connects a vision encoder and LLM for general-purpose visual and language understanding. Our early experiments show that LLaVA demonstrates impressive multimodal chat abilities, sometimes exhibiting the behaviors of multimodal GPT-4 on unseen images/instructions, and yields an 85.1% relative score compared with GPT-4 on a synthetic multimodal instruction-following dataset. When fine-tuned on Science QA, the synergy of LLaVA and GPT-4 achieves a new state-of-the-art accuracy of 92.53%.`,
      },
      {
        title: 'Visual instruction synthesis',
        body: `LLaVA's key idea is to use GPT-4 (text only) to write visual instruction-following data from image captions and bounding boxes. The captions and boxes come from existing datasets like COCO; GPT-4 turns them into questions, descriptions, and conversations about the image.

This sidesteps the cost of annotating visual instructions with humans and became the template for almost every later multimodal model.`,
      },
      {
        title: 'Architecture',
        body: `LLaVA connects a pretrained CLIP ViT-L/14 vision encoder to a Vicuna LLM via a single linear projection layer that maps vision tokens into the LLM's word embedding space. The LLM is fine-tuned on the synthetic visual instruction data; the vision encoder stays frozen.`,
      },
      {
        title: 'ScienceQA result',
        body: `On ScienceQA, LLaVA combined with GPT-4 (LLaVA as a retriever, GPT-4 as the final answer generator) reaches 92.53% accuracy — a new state of the art at the time, and the first time a multimodal model clearly beat the prior SOTA on a science benchmark.`,
      },
      {
        title: 'Why it matters',
        body: `LLaVA established the now-standard recipe for open multimodal models: a frozen pretrained vision encoder, a small projection layer, and instruction tuning on synthetic visual chat data. Almost every later VLM (MiniGPT-4, LLaVA-1.5, ShareGPT4V, etc.) is a direct descendant of this template.`,
      },
    ],
    note: 'A vision encoder and a language model do not need to be designed together to be glued together well. The seam is where the work happens.',
    path: [
      ['Projection layer', 'a small MLP maps vision tokens into the language model’s embedding space.'],
      ['Synthetic visual chat', 'GPT-4 writes the instruction–answer pairs to bootstrap the tuning.'],
      ['Open recipe', 'LLaVA’s training data and code are widely reused.'],
    ],
  },
  {
    id: 'minicpm',
    code: '2404.06395',
    year: '2024',
    title: 'MiniCPM: Unveiling the Potential of Small Language Models with Scalable Training Strategies',
    authors: 'Hu et al.',
    tags: ['small model', 'efficiency'],
    abstract: 'MiniCPM is a family of 2B parameter models trained with a “SLM as a Philosophy” approach. MiniCPM-2B matches or surpasses larger models on benchmarks while being efficient enough to deploy on phones and laptops.',
    sections: [
      {
        title: 'Abstract',
        body: `The burgeoning interest in developing LLMs with up to trillion parameters has been met with concerns regarding resource efficiency and practical expense, particularly given the immense cost of experimentation. This scenario underscores the importance of exploring the potential of Small Language Models (SLMs) as a resource-efficient alternative. We introduce MiniCPM, specifically the 1.2B and 2.4B non-embedding parameter variants, which excel in their respective categories and demonstrate capabilities on par with 7B-13B LLMs. Our approach exhibits scalability in both model and data dimensions. For model scaling, we employ extensive model wind tunnel experiments. For data scaling, we introduce a Warmup-Stable-Decay (WSD) learning rate scheduler, conducive to continuous training and domain adaptation. We present an in-depth analysis of the training dynamics that occur in the WSD LRS. With WSD, we are now able to efficiently study data-model scaling law without extensive retraining experiments.`,
      },
      {
        title: 'Warmup-Stable-Decay LR',
        body: `MiniCPM's main training-systems contribution is the WSD learning rate schedule: warm up to the peak, hold there for most of training, then decay sharply to zero. Unlike cosine, WSD supports a 'resume from any point' workflow — you can stop at any time during the stable phase and add more data or continue training without retraining from scratch.

The paper's analysis of the loss dynamics during the decay phase became a standard reference for SLM training.`,
      },
      {
        title: 'Scaling-law re-examination',
        body: `Using WSD's resumption property, the team re-derives a compute-optimal data-to-parameter ratio for SLMs and finds it is significantly higher than Chinchilla-optimal. In other words, small models benefit from more tokens per parameter than large models do — the opposite of what people had been assuming.

This result, more than any single model release, is what made WSD a default choice for small-model training.`,
      },
      {
        title: 'Why it matters',
        body: `MiniCPM is one of the strongest small LLMs released in 2024 and the first open-weights model where the training recipe (WSD + data scaling) is more influential than the architecture. It is the clearest demonstration yet that for sub-3B models, training infrastructure matters more than model size.`,
      },
    ],
    note: 'A 2B model on a phone is the new normal for serious on-device work. MiniCPM-2B reads like a thesis on what scale really means.',
    path: [
      ['WSD learning rate', 'a warmup–stable–decay schedule that gives consistently better results.'],
      ['Deep-and-narrow', 'more layers, fewer dimensions per layer, with rotary embeddings.'],
      ['Open release', 'weights, training code and recipes, including the model spec, are public.'],
    ],
  },
  {
    id: 'qwen2-vl',
    code: '2409.12191',
    year: '2024',
    title: 'Qwen2-VL: Enhancing Vision-Language Model’s Perception of the World at Any Resolution',
    authors: 'Wang et al.',
    tags: ['multimodal', 'vision-language'],
    abstract: 'Qwen2-VL introduces a Naive Dynamic Resolution mechanism to handle arbitrary input image sizes, Multimodal RoPE for joint positional encoding, and a unified interface for images, video, and text. The flagship 72B variant reaches state-of-the-art on multimodal benchmarks.',
    sections: [
      {
        title: 'Abstract',
        body: `We present the Qwen2-VL Series, an advanced upgrade of the previous Qwen-VL models that redefines the conventional predetermined-resolution approach in visual processing. Qwen2-VL introduces the Naive Dynamic Resolution mechanism, which enables the model to dynamically process images of varying resolutions into different numbers of visual tokens. This approach allows the model to generate more efficient and accurate visual representations, closely aligning with human perceptual processes. The model also integrates Multimodal Rotary Position Embedding (M-RoPE), facilitating the effective fusion of positional information across text, images, and videos. We employ a unified paradigm for processing both images and videos, enhancing the model's visual perception capabilities.`,
      },
      {
        title: 'Dynamic resolution',
        body: `Most VLMs resize every input image to a fixed resolution (typically 224×224 or 336×336) before patching. Qwen2-VL instead keeps images at their native resolution and converts them into a variable number of visual tokens, so a small thumbnail produces few tokens and a 4K document image produces many.

This matters disproportionately for document and chart understanding, where small text gets destroyed by aggressive resizing.`,
      },
      {
        title: 'Multimodal RoPE (M-RoPE)',
        body: `Qwen2-VL extends Rotary Position Embedding to three axes: temporal (token position in the sequence), spatial height, and spatial width. This lets one positional encoding carry both text ordering and image-grid coordinates, so the model can handle arbitrary image and video resolutions without per-size retraining.`,
      },
      {
        title: 'Agentic abilities',
        body: `Qwen2-VL-72B is tuned to operate a phone or browser from screenshots — given an image of a UI plus a natural-language instruction, it returns the next action. This is the same direction as Anthropic's computer-use demo, but open-weights.

The 72B flagship reaches results comparable to GPT-4o and Claude 3.5 Sonnet on multimodal benchmarks, and outperforms other open generalist VLMs at release.`,
      },
      {
        title: 'Why it matters',
        body: `Qwen2-VL is the first open VLM where dynamic resolution and M-RoPE are treated as first-class architectural choices rather than hacks. The 2B / 8B / 72B scaling also makes it the first open multimodal family with credible on-device to flagship coverage.`,
      },
    ],
    note: 'A vision tower that does not crop is closer to how humans read an image — at the size the image is, not at the size a model wants.',
    path: [
      ['Naive Dynamic Resolution', 'no fixed image size; the model adapts to whatever the user sends.'],
      ['Multimodal RoPE', 'a unified positional encoding for images, video, and text.'],
      ['Agentic abilities', 'tuned to operate a phone or browser from screenshots.'],
    ],
  },

  // ───────────────────────────── Page 5 · Open Frontier 2026 ─────────────────────────────
  {
    id: 'glm-5',
    code: '2602.15763',
    year: '2026',
    title: 'GLM-5: From Vibe Coding to Agentic Engineering',
    authors: 'GLM-5 Team',
    tags: ['foundation', 'agentic'],
    abstract: 'GLM-5 is a 744B-parameter MoE model with 40B activated, scaling from GLM-4.5 and trained on 28.5T tokens. The paper introduces DeepSeek Sparse Attention (DSA) for long-context efficiency, a new slime asynchronous RL infrastructure for post-training, and demonstrates strong agentic coding performance on real-world software engineering tasks.',
    sections: [
      {
        title: 'Abstract',
        body: 'GLM-5 is a 744B-parameter MoE model with 40B activated, scaling from GLM-4.5 and trained on 28.5T tokens. The paper introduces DeepSeek Sparse Attention (DSA) for long-context efficiency, a new slime asynchronous RL infrastructure for post-training, and demonstrates strong agentic coding performance on real-world software engineering tasks.',
      },
      {
        title: 'Architecture',
        body: 'The base model is a sparse MoE with 744B total / 40B active parameters, more than double GLM-4.5 (355B / 32B active). For long-context efficiency, GLM-5 adopts DeepSeek Sparse Attention (DSA): attention is computed only over a learned subset of cached key/value tokens, which keeps the cost of million-token contexts bounded.\n\nA four-stage curriculum (8K → 64K → 256K → 1M tokens) with synthetic long-horizon data trains the model to actually use the long window without collapsing to local patterns.',
      },
      {
        title: 'Post-training: slime async RL',
        body: 'Post-training has three stages: SFT on high-quality agent trajectories, RL on three task families (general, general-agentic, code-agentic) each split into three reasoning-effort buckets, and multi-teacher same-policy distillation that merges the nine specialists into one.\n\nThe RL infrastructure is the real story. slime is a co-located, asynchronous RL stack that decouples rollout generation from policy updates so slow long-horizon trajectories do not stall the cluster. Combined with FP8 mixed-precision training, slime lets the team run meaningful RL on a 744B model without burning through the kind of GPU budget closed labs use.',
      },
      {
        title: 'Results',
        body: 'On the in-house CC-Bench-V2 suite (frontend, backend, long-horizon tasks), GLM-5 substantially outperforms GLM-4.7 and closes most of the gap to Claude Opus 4.5.\n\nOn Vending Bench 2 — a one-year simulated vending-machine business that measures long-horizon planning and resource management — GLM-5 ranks #1 among open-source models with a final balance of $4,432, approaching Claude Opus 4.5 and ahead of GPT-5.5 and Claude Opus 4.7.',
      },
      {
        title: 'Why it matters',
        body: 'GLM-5 is the first open-weights model to credibly challenge frontier closed models on agentic engineering tasks. The technical contribution is not the model itself but the slime infrastructure: making long-horizon RL tractable at this scale is what lets a 744B model behave like an engineer instead of a chat partner, and it is what open labs will reuse across families.',
      },
    ],
    note: 'The frontier keeps splitting: a smaller, smarter open model on a shelf of recipes, with RL infrastructure that finally scales to million-token trajectories. Agentic engineering is now a problem of data + systems, not just parameters.',
    path: [
      ['DSA (DeepSeek Sparse Attention)', 'compresses long-context attention so deployment cost does not scale with token count.'],
      ['slime async RL', 'decouples rollout generation from policy updates, making post-training tractable at 744B.'],
      ['Vibe → agentic', 'the same model writes code, runs it, reads the failure, and iterates — closing the loop on engineering tasks.'],
    ],
  },
  {
    id: 'MiniMax-m3',
    code: '2606.13392',
    year: '2026',
    title: 'MiniMax-M3: A Native Multimodal Model with Sparse Attention and a Million-Token Context',
    authors: 'MiniMax-AI',
    tags: ['multimodal', 'efficiency'],
    abstract: 'MiniMax-M3 is a native multimodal model with a 1M-token context, ~428B total parameters, and ~23B activated. The paper introduces MiniMax Sparse Attention (MSA), which delivers 9× prefill and 15× decode speedups over M2 at 1M context, reducing per-token compute to 1/20. M3 is trained with mixed text/image/video from the first step, and reaches frontier coding and cowork performance.',
    sections: [
      {
        title: 'Abstract',
        body: `We introduce MiniMax Sparse Attention (MSA), a blockwise sparse attention built upon Grouped Query Attention (GQA). A lightweight Index Branch scores key-value blocks and independently selects a Top-k subset for each GQA group, enabling group-specific sparse retrieval while maintaining efficient block-level execution; the Main Branch then performs exact block-sparse attention over only the selected blocks. Designed around a principle of simplicity and scalability, MSA is deliberately streamlined, making it straightforward to deploy efficiently across a broad range of GPUs. To translate sparsity into practical speedups, we co-design MSA with a GPU execution path that uses exp-free Top-k selection and KV-outer sparse attention to improve tensor-core utilization under block-granular access. On a 109B-parameter model with native multimodal training, MSA performs on par with GQA while reducing per-token attention compute by 28.4× at 1M context. Paired with our co-designed kernel, MSA achieves 14.2× prefill and 7.6× decoding wall-clock speedups on H800.`,
      },
      {
        title: 'Architecture: MSA',
        body: `MiniMax-M3 is a native multimodal model with ~428B total / ~23B activated parameters, trained on text / image / video jointly from the first step, with a 1M-token context. The core innovation is MSA: a small Index Branch scores KV blocks inexpensively, and a Main Branch then runs exact block-sparse attention over only the Top-k blocks chosen by the indexer, on a per-GQA-group basis.

The sparsity is per-group, not global, so different query heads can attend to different blocks — which the paper shows preserves quality on multimodal and long-context tasks.`,
      },
      {
        title: 'GPU-co-designed kernel',
        body: `MSA is co-designed with a custom CUDA kernel. The Index Branch uses an exp-free Top-k selection that fits the tensor-core path, and the Main Branch runs KV-outer block-sparse attention that reuses dense matmul primitives instead of writing a custom sparse kernel from scratch.

This is the part that turns a theoretical 28.4× compute reduction into a 14.2× prefill and 7.6× decoding wall-clock speedup on H800.`,
      },
      {
        title: 'Long-context results',
        body: `On a 109B intermediate-scale model with native multimodal training, MSA matches full GQA quality while cutting per-token attention compute by 28.4× at 1M context. The kernel delivers 9× prefill and 15× decode speedups over MiniMax-M2 at the same 1M context length.`,
      },
      {
        title: 'Why it matters',
        body: `MiniMax-M3 is the first open model that treats 'serve a 1M-context multimodal MoE cheaply' as a solved systems problem, not a research goal. MSA is a stronger long-context play than most open-weights MoE attention variants and is released with a public kernel, so the rest of the field can build on it.`,
      },
    ],
    note: 'A million-token context stops being a curiosity when you can actually serve it cheaply. Sparse attention is the part that makes "native multimodal" a deployment story, not a benchmark screenshot.',
    path: [
      ['MSA (MiniMax Sparse Attention)', 'keeps the model\u2019s quality at long context while slashing prefill and decode cost.'],
      ['Native multimodality', 'text, image, and video are trained together from step one, not bolted on after.'],
      ['Coding + cowork', 'the same model sustains long-horizon agentic work, not just single-turn chat.'],
    ],
  },
  {
    id: 'kimi-k3',
    code: 'kimi-k3-2026',
    year: '2026',
    title: 'Kimi K3: An Open 3T-Class Model with Native Multimodality and 1M Context',
    authors: 'Moonshot AI',
    tags: ['mixture of experts', 'multimodal'],
    abstract: 'Kimi K3 is a 2.8T-parameter MoE model with 104B activated, native vision (MoonViT-V2), and 1M-token context. The paper introduces Kimi Delta Attention (KDA), a bounded linear attention that mixes 3:1 with Gated MLA; Attention Residuals (AttnRes) for selectively revisiting earlier layers; and Stable LatentMoE with 896 experts. A custom RL stack (partial rollouts, AgentENV microVMs, MoonEP expert parallelism) supports hour-long agentic training. Scaling efficiency improves ~2.5× over Kimi K2.',
    sections: [
      {
        title: 'Abstract',
        body: `Kimi K3 is a 2.8T-parameter MoE model with 104B activated, native vision (MoonViT-V2), and 1M-token context. The paper introduces Kimi Delta Attention (KDA), a bounded linear attention that mixes 3:1 with Gated MLA; Attention Residuals (AttnRes) for selectively revisiting earlier layers; and Stable LatentMoE with 896 experts. A custom RL stack (partial rollouts, AgentENV microVMs, MoonEP expert parallelism) supports hour-long agentic training. Scaling efficiency improves ~2.5× over Kimi K2.`,
      },
      {
        title: 'Architecture: KDA + Gated MLA',
        body: `Kimi K3's attention is a 3:1 mix of Kimi Delta Attention (KDA), a bounded linear attention that compresses history into a fixed-size state, and Gated MLA, a full-attention layer that periodically re-reads the raw context. KDA is parameterised with bounded decay so the matmul stays on dense tensor-core paths instead of falling back to custom kernels.

The result is that 1M-context inference stays cheap: KDA carries the long tail, Gated MLA rescues the global lookups.`,
      },
      {
        title: 'Architecture: Attention Residuals (AttnRes)',
        body: `Standard residual connections compress everything into a single hidden state, which loses information from intermediate layers as the network deepens. AttnRes lets each layer query a small set of earlier layer blocks (every ~12 layers, aggregated into 8 blocks) instead of just the previous output.

This is a way to bring the 'attend over the past' idea from sequence to depth, and it generalises outside MoE: any deep transformer could in principle use it.`,
      },
      {
        title: 'Architecture: Stable LatentMoE',
        body: `With 896 routed experts and 16 active per token, MoE load balancing becomes a numerical-stability problem as much as a routing problem. K3 introduces Stable LatentMoE: experts run on a 3584-dim latent (half the hidden width), the output is RMSNormed, and a SiTU-GLU activation caps the output magnitude so FP8 training does not overflow.

Load balancing is handled by Quantile Balancing, which adjusts per-expert routing bias from the empirical quantile of recent routing scores instead of incremental bias nudges.`,
      },
      {
        title: 'Training: slime and MoonEP',
        body: `K3's RL infrastructure is a co-located, asynchronous stack with partial rollouts: long agent trajectories pause while the policy updates, and Firecracker-based microVMs snapshot the agent's filesystem between turns. The team reports creating over 51M sandboxes during training and evaluation.

MoonEP is a custom expert-parallel communication library that dynamically duplicates hot experts so every GPU processes the same number of tokens. It is released open source.`,
      },
      {
        title: 'Results',
        body: `On Terminal-Bench 2.1, K3 lands within a few points of Claude Opus 4.8. On SWE-bench Pro it leads among open-weights models. On long-horizon kernel-optimization tasks that run for 12-24 hours, K3 sustains the longest continuous improvement among the open models.

K3 also ships native multimodal: MoonViT-V2 is trained from scratch with next-token prediction, not from a CLIP-style contrastive warmup, and the paper shows this is more stable and equally capable.`,
      },
      {
        title: 'Why it matters',
        body: `Kimi K3 is the first open-weights 3T-class model, and the first to ship hour-long agent RL as a first-class training regime. The interesting parts are not the parameter count but the systems stack: bounded attention, depth-attention, latent experts, partial rollouts, snapshot sandboxes. Each of these is independently reusable.`,
      },
    ],
    note: 'The interesting part is not the parameter count but the systems stack: an attention that compresses, residuals that rewind, experts that balance by quantiles, and a sandbox that pauses while the model thinks. Long-horizon agents need all four at once.',
    pdfUrl: 'https://raw.githubusercontent.com/MoonshotAI/Kimi-K3/main/k3_tech_report.pdf',
    absUrl: 'https://github.com/MoonshotAI/Kimi-K3',
    venue: 'Tech Report',
    path: [
      ['KDA + Gated MLA', 'a 3:1 mix of bounded linear attention and global attention keeps the long context cheap.'],
      ['AttnRes', 'attends back to earlier layer blocks, not just the previous hidden state — depth stops being a one-way street.'],
      ['MoonEP + partial rollout', 'hardware-level expert balancing and resumable sandboxes let the same loop train hour-long agent trajectories.'],
    ],
  },
]

export const totalPages = Math.ceil(papers.length / PAGE_SIZE)
