var documenterSearchIndex = {"docs":
[{"location":"intro/","page":"Introduction","title":"Introduction","text":"There are lots of packages for working with probability distributions. But very often, we need to work with \"distributions\" that really aren't. ","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"For example, the correspondence between regularization and Bayesian prior distributions leads naturally to the idea of extending probabilistic programming systems to cover both. But it's easy to come up with a loss function for which the integral of the corresponding \"prior\" is infinite! The result is not really a distirbution. It is, however, still a measure.","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"Even restricted to Bayesian methods, users might sometimes want to use an improper prior. By definition, these cannot be integrated over their domain. But an improper prior is still a measure.","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"In Markov chain Monte Carlo (MCMC), we often work with distributions for which we can only caluculate  the log-density up to an additive constant. Considering this instead as a measure can be helpful. Even better, consdering intermediate computations along the way as computations on measures saves us from computing normalization terms where the end result will discard this anyway.","category":"page"},{"location":"intro/","page":"Introduction","title":"Introduction","text":"To be clear, that's not to say that we always discard normalizations. Rather, they're considered as belonging to the measure itself, rather than being included in each sub-computation. If measures you work with happen to also be probability distributions, you'll always be able to recover those results.","category":"page"},{"location":"adding/#Adding-a-New-Measure","page":"Adding a New Measure","title":"Adding a New Measure","text":"","category":"section"},{"location":"adding/#Parameterized-Measures","page":"Adding a New Measure","title":"Parameterized Measures","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"This is by far the most common kind of measure, and is especially useful as a way to describe families of probability distributions.","category":"page"},{"location":"adding/#Declaring-a-Parameterized-Measure","page":"Adding a New Measure","title":"Declaring a Parameterized Measure","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"To start, declare a @parameterized. For example, Normal is declared as","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"@parameterized Normal(μ,σ) ≪ (1/sqrt2π) * Lebesgue(ℝ)","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"[ℝ is typed as \\bbR <TAB>]","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"A ParameterizedMeasure can have multiple parameterizations, which as dispatched according to the names of the parameters. The (μ,σ) here specifies names to assign if none are given. So for example,","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"julia> Normal(-3.0, 2.1)\nNormal(μ = -3.0, σ = 2.1)","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The right side, (1/sqrt2π) * Lebesgue(ℝ), gives the base measure. Lebesgue in this case is the technical name for the measure associating an interval of real numbers to its length. The (1/sqrt2π) comes from the normalization constant in the probability density function,","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"f_textNormal(xμσ) = frac1σ sqrt2 pi e^-frac12left(fracx-musigmaright)^2  ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Making this part of the base measure allows us to avoid including it in every computation.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The ≪ (typed as \\ll <TAB>) can be read \"is dominated by\". This just means that any set for which the base measure is zero must also have zero measure in what we're defining.","category":"page"},{"location":"adding/#Defining-a-Log-Density","page":"Adding a New Measure","title":"Defining a Log Density","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Most computations involve log-densities rather than densities themselves, so these are our first priority. density(d,x) will default to exp(logdensity(d,x)), but you can add a separate method if it's more efficient.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The definition is simple:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"logdensity(d::Normal{()} , x) = - x^2 / 2 ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"There are a few things here worth noting.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"First, we dispatch by the names of d (here there are none), and the type of x is not specified.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Also, there's nothing here about μ and σ. These location-scale parameters behave exactly the same across lots of distributions, so we have a macro to add them:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"@μσ_methods Normal()","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Let's look at another example, the Beta distribution. Here the base measure is Lebesgue(𝕀) (support is the unit interval). The log-density is","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"function logdensity(d::Beta{(:α, :β)}, x)\n    return (d.α - 1) * log(x) + (d.β - 1) * log(1 - x) - logbeta(d.α, d.β)\nend","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Note that when possible, we avoid extra control flow for checking that x is in the support. In applications, log-densities are often evaluated only on the support by design. Such checks should be implemented at a higher level whenever there is any doubt.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Finally, note that in both of these examples, the log-density has a relatively direct algebraic form. It's imnportant to have this whenever possible to allow for symbolic manipulation (using libraries like SymolicUtils.jl) and efficient automatic differentiation.","category":"page"},{"location":"adding/#Random-Sampling","page":"Adding a New Measure","title":"Random Sampling","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For univariate distributions, you should define a Base.rand method that uses three arguments:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"A Random.AbstractRNG to use for randomization,\nA type to be returned, and\nThe measure to sample from.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For our Normal example, this is","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Base.rand(rng::Random.AbstractRNG, T::Type, d::Normal{()}) = randn(rng, T)","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Again, for location-scale families, other methods are derived automatically. ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For multivariate distributions (or anything that requires heap allocation), you should instead define a Random.rand! method. This also takes three arguments, different from rand:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"The Random.AbstractRNG,\nThe measure to sample from, and\nWhere to store the result.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"For example, here's the implementation for ProductMeasure:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"@propagate_inbounds function Random.rand!(rng::AbstractRNG, d::ProductMeasure, x::AbstractArray)\n    @boundscheck size(d.data) == size(x) || throw(BoundsError)\n\n    @inbounds for j in eachindex(x)\n        x[j] = rand(rng, eltype(x), d.data[j])\n    end\n    x\nend","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Note that in this example, d.data[j] might itself require allocation. This implementation is likely to change in the future to make it easier to define nested structures without any need for ongoing allocation.","category":"page"},{"location":"adding/#Primitive-Measures","page":"Adding a New Measure","title":"Primitive Measures","text":"","category":"section"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Most measures are defined in terms of a logdensity with respect to some other measure, its basemeasure. But how is that measure defined? It can't be \"densities all the way down\"; at some point, the chain has to stop.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"A primitive measure is just a measure that has itself as its own base measure. Note that this also means its log-density is always zero.","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"Here's the implementation of Lebesgue:","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"struct Lebesgue{X} <: AbstractMeasure end\n\nLebesgue(X) = Lebesgue{X}()\n\nbasemeasure(μ::Lebesgue) = μ\n\nisprimitive(::Lebesgue) = true\n\nsampletype(::Lebesgue{ℝ}) = Float64\nsampletype(::Lebesgue{ℝ₊}) = Float64\nsampletype(::Lebesgue{𝕀}) = Float64\n\nlogdensity(::Lebesgue, x) = zero(float(x))","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"We haven't yet talked about sampletype. When you call rand without specifying a type, there needs to be a default. That default is the sampletype. This only needs to be defined for primitive measures, because others will fall back on ","category":"page"},{"location":"adding/","page":"Adding a New Measure","title":"Adding a New Measure","text":"sampletype(μ::AbstractMeasure) = sampletype(basemeasure(μ))","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = MeasureTheory","category":"page"},{"location":"#MeasureTheory","page":"Home","title":"MeasureTheory","text":"","category":"section"},{"location":"#API","page":"Home","title":"API","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [MeasureTheory]","category":"page"},{"location":"#MeasureTheory.CorrCholesky","page":"Home","title":"MeasureTheory.CorrCholesky","text":"CorrCholesky(n)\n\nCholesky factor of a correlation matrix of size n. Transforms n(n-1)2 real numbers to an nn lower-triangular matrix L, such that L*L' is a correlation matrix (positive definite, with unit diagonal).\n\nNotes\n\nIf\n\nz is a vector of n IID standard normal variates,\nσ is an n-element vector of standard deviations,\nC is obtained from CorrCholesky(n),\n\nthen Diagonal(σ) * C.L * z is a zero-centered multivariate normal variate with the standard deviations σ and correlation matrix C.L * C.U.\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.Density","page":"Home","title":"MeasureTheory.Density","text":"struct Density{M,B}\n    μ::M\n    base::B\nend\n\nFor measures μ and ν with μ≪ν, the density of μ with respect to ν (also called the Radon-Nikodym derivative dμ/dν) is a function f defined on the support of ν with the property that for any measurable a ⊂ supp(ν), μ(a) = ∫ₐ f dν.\n\nBecause this function is often difficult to express in closed form, there are many different ways of computing it. We therefore provide a formal representation to allow comptuational flexibilty.\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.DensityMeasure","page":"Home","title":"MeasureTheory.DensityMeasure","text":"struct DensityMeasure{F,B} <: AbstractMeasure\n    density :: F\n    base    :: B\nend\n\nA DensityMeasure is a measure defined by a density with respect to some other \"base\" measure \n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.LKJCholesky","page":"Home","title":"MeasureTheory.LKJCholesky","text":"LKJCholesky(k=3, η=1.0)\nLKJCholesky(k=3, logη=0.0)\n\nLKJCholesky(k, ...) gives the k×k LKJ distribution (Lewandowski et al 2009) expressed as a Cholesky decomposition. As a special case, for C = rand(LKJCholesky(k=K, η=1.0)) (or equivalently C=rand(LKJCholesky{k}(k=K, logη=0.0))), C.L * C.U is uniform over the set of all K×K correlation matrices. Note, however, that in this case C.L and C.U are not sampled uniformly (because the multiplication is nonlinear).\n\nThe logdensity method for this measure applies for LowerTriangular, UpperTriangular, or Diagonal matrices, and will \"do the right thing\". The logdensity does not check if L*U yields a valid correlation matrix.\n\nValid values are η  0. When η  1, the distribution is unimodal with a peak at I, while 0  η  1 yields a trough. η = 2 is recommended as a vague prior.\n\nAdapted from https://github.com/tpapp/AltDistributions.jl\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.Likelihood","page":"Home","title":"MeasureTheory.Likelihood","text":"Likelihood(M<:ParameterizedMeasure, x)\n\n\"Observe\" a value x, yielding a function from the parameters to ℝ.\n\nLikelihoods are most commonly used in conjunction with an existing prior measure to yield a new measure, the posterior. In Bayes's Law, we have\n\nP(θx)  P(θ) P(xθ)\n\nHere P(θ) is the prior. If we consider P(xθ) as a function on θ, then it is called a likelihood.\n\nSince measures are most commonly manipulated using density and logdensity, it's awkward to commit a (log-)likelihood to using one or the other. To evaluate a Likelihood, we therefore use density or logdensity, depending on the circumstances. In the latter case, it is of course acting as a log-density.\n\nFor example,\n\njulia> ℓ = Likelihood(Normal{(:μ,)}, 2.0)\nLikelihood(Normal{(:μ,), T} where T, 2.0)\n\njulia> density(ℓ, (μ=2.0,))\n1.0\n\njulia> logdensity(ℓ, (μ=2.0,))\n-0.0\n\nIf, as above, the measure includes the parameter information, we can optionally leave it out of the second argument in the call to density or logdensity. \n\njulia> density(ℓ, 2.0)\n1.0\n\njulia> logdensity(ℓ, 2.0)\n-0.0\n\nWith several parameters, things work as expected:\n\njulia> ℓ = Likelihood(Normal{(:μ,:σ)}, 2.0)\nLikelihood(Normal{(:μ, :σ), T} where T, 2.0)\n\njulia> logdensity(ℓ, (μ=2, σ=3))\n-1.0986122886681098\n\njulia> logdensity(ℓ, (2,3))\n-1.0986122886681098\n\njulia> logdensity(ℓ, [2, 3])\n-1.0986122886681098\n\n\n\nLikelihood(M<:ParameterizedMeasure, constraint::NamedTuple, x)\n\nIn some cases the measure might have several parameters, and we may want the (log-)likelihood with respect to some subset of them. In this case, we can use the three-argument form, where the second argument is a constraint. For example,\n\njulia> ℓ = Likelihood(Normal{(:μ,:σ)}, (σ=3.0,), 2.0)\nLikelihood(Normal{(:μ, :σ), T} where T, (σ = 3.0,), 2.0)\n\nSimilarly to the above, we have\n\njulia> density(ℓ, (μ=2.0,))\n0.3333333333333333\n\njulia> logdensity(ℓ, (μ=2.0,))\n-1.0986122886681098\n\njulia> density(ℓ, 2.0)\n0.3333333333333333\n\njulia> logdensity(ℓ, 2.0)\n-1.0986122886681098\n\n\n\nFinally, let's return to the expression for Bayes's Law, \n\nP(θx)  P(θ) P(xθ)\n\nThe product on the right side is computed pointwise. To work with this in MeasureTheory, we have a \"pointwise product\" ⊙, which takes a measure and a likelihood, and returns a new measure, that is, the unnormalized posterior that has density P(θ) P(xθ) with respect to the base measure of the prior.\n\nFor example, say we have\n\nμ ~ Normal()\nx ~ Normal(μ,σ)\nσ = 1\n\nand we observe x=3. We can compute the posterior measure on μ as\n\njulia> post = Normal() ⊙ Likelihood(Normal{(:μ, :σ)}, (σ=1,), 3)\nNormal() ⊙ Likelihood(Normal{(:μ, :σ), T} where T, (σ = 1,), 3)\n\njulia> logdensity(post, 2)\n-2.5\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.SuperpositionMeasure","page":"Home","title":"MeasureTheory.SuperpositionMeasure","text":"struct SuperpositionMeasure{X,NT} <: AbstractMeasure\n    components :: NT\nend\n\nSuperposition of measures is analogous to mixture distributions, but (because measures need not be normalized) requires no scaling.\n\nThe superposition of two measures μ and ν can be more concisely written as μ + ν.\n\nSuperposition measures satisfy\n\nbasemeasure(μ + ν) == basemeasure(μ) + basemeasure(ν)\n\n\n\n\n\n","category":"type"},{"location":"#MeasureTheory.For-Tuple{Any, Vararg{Any, N} where N}","page":"Home","title":"MeasureTheory.For","text":"For(f, base...)\n\nFor provides a convenient way to construct a ProductMeasure. There are several options for the base. With Julia's do notation, this can look very similar to a standard for loop, while maintaining semantics structure that's easier to work with.\n\n\n\nFor(f, base::Int...)\n\nWhen one or several Int values are passed for base, the result is treated as depending on CartesianIndices(base). \n\njulia> For(3) do λ Exponential(λ) end |> marginals\n3-element mappedarray(MeasureTheory.var\"#17#18\"{var\"#15#16\"}(var\"#15#16\"()), ::CartesianIndices{1, Tuple{Base.OneTo{Int64}}}) with eltype Exponential{(:λ,), Tuple{Int64}}:\n Exponential(λ = 1,)\n Exponential(λ = 2,)\n Exponential(λ = 3,)\n\njulia> For(4,3) do μ,σ Normal(μ,σ) end |> marginals\n4×3 mappedarray(MeasureTheory.var\"#17#18\"{var\"#11#12\"}(var\"#11#12\"()), ::CartesianIndices{2, Tuple{Base.OneTo{Int64}, Base.OneTo{Int64}}}) with eltype Normal{(:μ, :σ), Tuple{Int64, Int64}}:\n Normal(μ = 1, σ = 1)  Normal(μ = 1, σ = 2)  Normal(μ = 1, σ = 3)\n Normal(μ = 2, σ = 1)  Normal(μ = 2, σ = 2)  Normal(μ = 2, σ = 3)\n Normal(μ = 3, σ = 1)  Normal(μ = 3, σ = 2)  Normal(μ = 3, σ = 3)\n Normal(μ = 4, σ = 1)  Normal(μ = 4, σ = 2)  Normal(μ = 4, σ = 3)\n\n\n\nFor(f, base::AbstractArray...)`\n\nIn this case, base behaves as if the arrays are zipped together before applying the map.\n\njulia> For(randn(3)) do x Exponential(x) end |> marginals\n3-element mappedarray(x->Main.Exponential(x), ::Vector{Float64}) with eltype Exponential{(:λ,), Tuple{Float64}}:\n Exponential(λ = -0.268256,)\n Exponential(λ = 1.53044,)\n Exponential(λ = -1.08839,)\n\njulia> For(1:3, 1:3) do μ,σ Normal(μ,σ) end |> marginals\n3-element mappedarray((:μ, :σ)->Main.Normal(μ, σ), ::UnitRange{Int64}, ::UnitRange{Int64}) with eltype Normal{(:μ, :σ), Tuple{Int64, Int64}}:\n Normal(μ = 1, σ = 1)\n Normal(μ = 2, σ = 2)\n Normal(μ = 3, σ = 3)\n\n\n\nFor(f, base::Base.Generator)\n\nFor Generators, the function maps over the values of the generator:\n\njulia> For(eachrow(rand(4,2))) do x Normal(x[1], x[2]) end |> marginals |> collect\n4-element Vector{Normal{(:μ, :σ), Tuple{Float64, Float64}}}:\n Normal(μ = 0.255024, σ = 0.570142)\n Normal(μ = 0.970706, σ = 0.0776745)\n Normal(μ = 0.731491, σ = 0.505837)\n Normal(μ = 0.563112, σ = 0.98307)\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.asparams","page":"Home","title":"MeasureTheory.asparams","text":"asparams build on TransformVariables.as to construct bijections to the parameter space of a given parameterized measure. Because this is only possible for continuous parameter spaces, we allow constraints to assign values to any subset of the parameters.\n\n\n\nasparams(::Type{<:ParameterizedMeasure}, ::Val{::Symbol})\n\nReturn a transformation for a particular parameter of a given parameterized measure. For example,\n\njulia> asparams(Normal, Val(:σ))\nasℝ₊\n\n\n\nasparams(::Type{<: ParameterizedMeasure{N}}, constraints::NamedTuple) where {N}\n\nReturn a transformation for a given parameterized measure subject to the named tuple constraints. For example,\n\njulia> asparams(Binomial{(:p,)}, (n=10,))\nTransformVariables.TransformTuple{NamedTuple{(:p,), Tuple{TransformVariables.ScaledShiftedLogistic{Float64}}}}((p = as𝕀,), 1)\n\n\n\naspararams(::ParameterizedMeasure)\n\nReturn a transformation with no constraints. For example,\n\njulia> asparams(Normal{(:μ,:σ)})\nTransformVariables.TransformTuple{NamedTuple{(:μ, :σ), Tuple{TransformVariables.Identity, TransformVariables.ShiftedExp{true, Float64}}}}((μ = asℝ, σ = asℝ₊), 2)\n\n\n\n\n\n","category":"function"},{"location":"#MeasureTheory.kernel","page":"Home","title":"MeasureTheory.kernel","text":"kernel(f, M)\nkernel((f1, f2, ...), M)\n\nA kernel κ = kernel(f, m) returns a wrapper around a function f giving the parameters for a measure of type M, such that κ(x) = M(f(x)...) respective κ(x) = M(f1(x), f2(x), ...)\n\nIf the argument is a named tuple (;a=f1, b=f1), κ(x) is defined as M(;a=f(x),b=g(x)).\n\nReference\n\nhttps://en.wikipedia.org/wiki/Markov_kernel\n\n\n\n\n\n","category":"function"},{"location":"#MeasureTheory.logdensity","page":"Home","title":"MeasureTheory.logdensity","text":"logdensity(μ::AbstractMeasure [, ν::AbstractMeasure], x::X)\n\nCompute the logdensity of the measure μ at the point x. This is the standard way to define logdensity for a new measure. the base measure is implicit here, and is understood to be basemeasure(μ).\n\n\n\n\n\n","category":"function"},{"location":"#MeasureTheory.rootmeasure-Tuple{AbstractMeasure}","page":"Home","title":"MeasureTheory.rootmeasure","text":"rootmeasure(μ::AbstractMeasure)\n\nIt's sometimes important to be able to find the fix point of a measure under basemeasure. That is, to start with some measure and apply basemeasure repeatedly until there's no change. That's what this does.\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.∫-Tuple{Any, AbstractMeasure}","page":"Home","title":"MeasureTheory.∫","text":"∫(f, base::AbstractMeasure; log=false)\n\nDefine a new measure in terms of a density f over some measure base. If log=true (false is the default), f is considered as a log-density.\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.𝒹-Tuple{AbstractMeasure, AbstractMeasure}","page":"Home","title":"MeasureTheory.𝒹","text":"𝒹(μ::AbstractMeasure, base::AbstractMeasure; log=false)\n\nCompute the Radom-Nikodym derivative (or its log, if log=false) of μ with respect to base.\n\n\n\n\n\n","category":"method"},{"location":"#MeasureTheory.@domain-Tuple{Any, Any}","page":"Home","title":"MeasureTheory.@domain","text":"@domain(name, T)\n\nDefines a new singleton struct T, and a value name for building values of that type.\n\nFor example, @domain ℝ RealNumbers is equivalent to\n\nstruct RealNumbers <: AbstractDomain end\n\nexport ℝ\n\nℝ = RealNumbers()\n\nBase.show(io::IO, ::MIME\"text/plain\", ::RealNumbers) = print(io, \"ℝ\")\n\n\n\n\n\n","category":"macro"},{"location":"#MeasureTheory.@half-Tuple{Any}","page":"Home","title":"MeasureTheory.@half","text":"@half dist([paramnames])\n\nStarting from a symmetric univariate measure dist ≪ Lebesgue(ℝ), create a new measure Halfdist ≪ Lebesgue(ℝ₊). For example,\n\n@half Normal()\n\ncreates HalfNormal(), and \n\n@half StudentT(ν)\n\ncreates HalfStudentT(ν).\n\n\n\n\n\n","category":"macro"},{"location":"#MeasureTheory.@parameterized-Tuple{Any}","page":"Home","title":"MeasureTheory.@parameterized","text":"@parameterized <declaration>\n\nThe <declaration> gives a measure and its default parameters, and specifies its relation to its base measure. For example,\n\n@parameterized Normal(μ,σ)\n\ndeclares the Normal is a measure with default parameters μ and σ. The result is equivalent to\n\nstruct Normal{N,T} <: ParameterizedMeasure{N}\n    par :: NamedTuple{N,T}\nend\n\nKeywordCalls.@kwstruct Normal(μ,σ)\n\nNormal(μ,σ) = Normal((μ=μ, σ=σ))\n\nSee KeywordCalls.jl for details on @kwstruct.\n\n\n\n\n\n","category":"macro"}]
}
