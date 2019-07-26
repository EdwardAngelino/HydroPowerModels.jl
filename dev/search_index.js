var documenterSearchIndex = {"docs":
[{"location":"#HydroPowerModels.jl-Documentation-1","page":"Home","title":"HydroPowerModels.jl Documentation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"CurrentModule = HydroPowerModels","category":"page"},{"location":"#Overview-1","page":"Home","title":"Overview","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"HydroPowerModels.jl is a Julia/JuMP package for Hydrothermal Multistage Steady-State Power Network Optimization solved by Stochastic Dual Dynamic Programming (SDDP). ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Problem Specifications and Network Formulations are handled by PowerModels.jl. ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Solution method is handled by SDDP.jl.","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"HydroPowerModels.jl relies on an unregistered package called SDDP, so you will need to add it as follows:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia> ] add https://github.com/odow/SDDP.jl/#master ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The current package is unregistered so you will need to add it as follows:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia> ] add https://github.com/andrewrosemberg/HydroPowerModels.jl.git ","category":"page"},{"location":"getstarted/#Getting-started-1","page":"Manual","title":"Getting started","text":"","category":"section"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Once PowerModels, SDDP and a solver (like GLPK or Ipopt) are installed, and a case data folder (e.g. \"case3\") has been acquired, an Hydrothermal Multistage Steady-State Power Network Optimization can be executed.","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"First import the necessary packages:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"using HydroPowerModels\nusing Ipopt, GLPK","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Load Case by passing the respective folder:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"data = HydroPowerModels.parse_folder(\"case3_folderpath\")","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Set Parameters to run, for example, an DC Economic Hydrothermal Dispatch:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"params = create_param( stages = 12, \n                    model_constructor_grid  = DCPPowerModel,\n                    post_method             = PowerModels.post_opf,\n                    optimizer               = with_optimizer(GLPK.Optimizer));","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Build the Model and execute the SDDP method:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"m = hydrothermaloperation(data, params)\n\nHydroPowerModels.train(m;iteration_limit = 60);","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Simulate 100 Instances of the problem:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"results = HydroPowerModels.simulate(m, 100);","category":"page"},{"location":"getstarted/#Getting-Results-1","page":"Manual","title":"Getting Results","text":"","category":"section"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"The simulate command in HydroPowerModels returns a detailed execution data in the form of a dictionary.","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"For example, the algorithm's runtime and original case data can be accessed with:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"results[:solve_time]\nresults[:data]","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Simulation results are found in the simulations array inside the dictionary, which every element is an array containing information of all stages. For example, information about the 10th simulation, as objective value and sampled noise of the first stage, may be accessed with:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"results[:simulations][10][1][:objective]\nresults[:simulations][10][1][:noise]","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"The :powersystem field contains detailed information about the grid solution returned by the PowerModels package, like generation and bus informations (inside the subitem \"solution\") and status (\"OPTIMAL\", \"INFEASIBLE\",...) of the solution execution. For example, the status of the solution execution and the active generation of the 2th generator on the jth stage and ith simulation can be inspect by:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"results[:simulations][1][2][:powersystem][\"status\"]\n\nresults[:simulations][i][j][:powersystem][\"solution\"][\"gen\"][\"2\"][\"pg\"]","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Reservoirs menagement information, like outflow and spillage, are found inside the :reservoirs field:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"results[:simulations][i][j][:reservoirs][:outflow]\n\nresults[:simulations][i][j][:reservoirs][:spill]","category":"page"},{"location":"getstarted/#Plotting-Results-1","page":"Manual","title":"Plotting Results","text":"","category":"section"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"In order to plot the results returned by the simulate function, you may choose from a variety of methods.","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"The function ’plotresults()’ receives a results dictionary and generates the most common plots for a hydrothermal dispatch: ","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"HydroPowerModels.plotresults(results)","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"Otherwise, it helps to organize values of a variable for all simulations and stages into a matrix and then plot using the  'plotscenarios'. The 'plotscenarios' function indicates the median and the following quantiles: [5%, 15%, 25%, 75%, 85%, 95%]. For example, to plot the values of the active generation of the 1st generator:","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"baseMVA =  [results[:simulations][i][j][:powersystem][\"solution\"][\"baseMVA\"] for i=1:100, j=1:12]'\n\nscen_gen = [results[:simulations][i][j][:powersystem][\"solution\"][\"gen\"][\"$gen\"][\"pg\"] for i=1:100, j=1:12]'.*baseMVA\n\nHydroPowerModels.plotscenarios(scen_gen, title  = \"Thermal Generation 1\",\n                ylabel = \"MW\",\n                xlabel = \"Stages\",\n                bottom_margin = 10mm,\n                right_margin = 10mm,\n                left_margin = 10mm                \n                )","category":"page"},{"location":"getstarted/#","page":"Manual","title":"Manual","text":"For those familiar with other plot functions may use them with no big dificulty.","category":"page"},{"location":"examples/cases/#","page":"-","title":"-","text":"Case reports are generated during the package building to test package functionalities and provide examples:","category":"page"},{"location":"examples/cases/#","page":"-","title":"-","text":"https://andrewrosemberg.github.io/HydroPowerModels.jl/latest/examples/case3_5years","category":"page"},{"location":"examples/cases/#","page":"-","title":"-","text":"https://andrewrosemberg.github.io/HydroPowerModels.jl/latest/examples/case3_ac","category":"page"},{"location":"examples/cases/#","page":"-","title":"-","text":"https://andrewrosemberg.github.io/HydroPowerModels.jl/latest/examples/case3_soc","category":"page"},{"location":"case3/#","page":"-","title":"-","text":"EditURL = \"https://github.com/andrewrosemberg/HydroPowerModels.jl/blob/master/../../../../build/andrewrosemberg/HydroPowerModels.jl/examples/HydroValleys/case3.jl\"","category":"page"},{"location":"case3/#","page":"-","title":"-","text":"#' ---\n#' title : Example Case 3 - Year Planning\n#' author : Andrew Rosemberg\n#' date : 15th Feb 2019\n#' ---\n\n#' # Introduction\n\n#' This an example of the HydroPowerModels package for solving a simple stochastic case with the following specifications:\n#'    - 3 Buses\n#'    - 3 Lines\n#'    - 2 Generators\n#'    - 1 Reservoir and Hydrogenerator\n#'    - 3 Scenarios\n#'    - 12 Stages\n\n#' # Case\n\n#' ## Importing package and optimizer\nusing GLPK\nusing HydroPowerModels\n\n#' ## Initialization","category":"page"},{"location":"case3/#","page":"-","title":"-","text":"if !@isdefined plot_bool\n    plot_bool = true\nend\nusing Random\nseed = 1221\n\n#' ## Load Case Specifications\n\n#' Data\nalldata = HydroPowerModels.parse_folder(joinpath(testcases_dir,\"case3\"));\n\n#' Plot power grid graph\nif plot_bool == true\n    Random.seed!(seed)\n    HydroPowerModels.plot_grid(alldata[1],node_label=false)\nend\n\n#' Parameters\nparams = create_param(  stages = 12,\n                        model_constructor_grid  = DCPPowerModel,\n                        post_method             = PowerModels.post_opf,\n                        optimizer               = with_optimizer(GLPK.Optimizer));\n\n#' ## Build Model","category":"page"},{"location":"case3/#","page":"-","title":"-","text":"m = hydrothermaloperation(alldata, params);\n\n#' ## Train","category":"page"},{"location":"case3/#","page":"-","title":"-","text":"start_time = time()\nHydroPowerModels.train(m,iteration_limit = 100,stopping_rules= [SDDP.Statistical(num_replications = 20,iteration_period=20)]);\nend_time = time() - start_time\n\n#' Termination Status and solve time (s)\n(SDDP.termination_status(m.policygraph), end_time)\n\n#' Bounds\nif plot_bool == true\n    HydroPowerModels.plot_bound(m)\nend\n\n#' ## Simulation\nimport Random\nRandom.seed!(seed)\nresults = HydroPowerModels.simulate(m, 100);\nresults\n\n#' ## Testing Results\nusing Test\n#' Bound\n@test isapprox(SDDP.calculate_bound(m.policygraph), 15297.53846353836, atol=1)\n#' Number of Simulations\n@test length(results[:simulations]) == 100\n\n#' ## Plot Aggregated Results\nif plot_bool == true\n    HydroPowerModels.plot_aggregated_results(results)\nend\n\n#' # Annex 1: Case Summary\nif plot_bool == true\n    PowerModels.print_summary(alldata[1][\"powersystem\"])\nend\n\n#' # Annex 2: Plot Results\nif plot_bool == true\n    HydroPowerModels.plotresults(results)\nend","category":"page"},{"location":"case3/#","page":"-","title":"-","text":"This page was generated using Literate.jl.","category":"page"},{"location":"apireference/#API-Reference-1","page":"Reference","title":"API Reference","text":"","category":"section"},{"location":"apireference/#Hydro-power-model-1","page":"Reference","title":"Hydro power model","text":"","category":"section"},{"location":"apireference/#","page":"Reference","title":"Reference","text":"HydroPowerModels.hydrothermaloperation","category":"page"},{"location":"apireference/#HydroPowerModels.hydrothermaloperation","page":"Reference","title":"HydroPowerModels.hydrothermaloperation","text":"hydrothermaloperation(alldata::Array{Dict{Any,Any}}, params::Dict)\n\nCreate a hydrothermal power operation model containing the policygraph the system data and the planning parameters.\n\nRequired parameters are:\n\ndata is a dict with all information of the problem. \nparam is a dict containing solution parameters.\n\n\n\n\n\n","category":"function"},{"location":"apireference/#System-data-and-parameters-1","page":"Reference","title":"System data and parameters","text":"","category":"section"},{"location":"apireference/#","page":"Reference","title":"Reference","text":"HydroPowerModels.parse_file_json\nHydroPowerModels.create_param","category":"page"},{"location":"apireference/#HydroPowerModels.parse_file_json","page":"Reference","title":"HydroPowerModels.parse_file_json","text":"Read hydro description json file.\n\n\n\n\n\n","category":"function"},{"location":"apireference/#HydroPowerModels.create_param","page":"Reference","title":"HydroPowerModels.create_param","text":"create_param(;stages::Int = 1,\n    model_constructor_grid = DCPPowerModel,\n    model_constructor_grid_backward = model_constructor_grid,\n    model_constructor_grid_forward = model_constructor_grid_backward,\n    post_method = PowerModels.post_opf,\n    optimizer = with_optimizer(GLPK.Optimizer),\n    optimizer_backward = optimizer,\n    optimizer_forward = optimizer_backward,\n    setting = Dict(\"output\" => Dict(\"branch_flows\" => true,\"duals\" => true)),\n    verbose = false,\n    stage_hours = 1)\n\nCreate Parameters Dictionary.\n\nKeywords are:\n\nstages::Int             : Number of stages.\nmodelconstructorgrid  : Network formulation (Types from https://github.com/lanl-ansi/PowerModels.jl).\noptimizer               : Optimizer factory (http://www.juliaopt.org/JuMP.jl/v0.19.0/solvers/).\nsetting                 : PowerModels settings (https://github.com/lanl-ansi/PowerModels.jl/blob/e28644bf85232a5322adeeb847c0d18b7ff4f235/src/core/base.jl#L6-L34)) .\nverbose                 : Boolean to indicate information prints.\nstage_hours             : Number of hours in each stage.\n\n\n\n\n\n","category":"function"},{"location":"apireference/#Training-the-policy-1","page":"Reference","title":"Training the policy","text":"","category":"section"},{"location":"apireference/#","page":"Reference","title":"Reference","text":"HydroPowerModels.train","category":"page"},{"location":"apireference/#HydroPowerModels.train","page":"Reference","title":"HydroPowerModels.train","text":"train(hydromodel::HydroPowerModel;kwargs...)\n\nTrain future cost function using SDDP.\n\nKeyword arguments (same as SDDP.train): https://github.com/odow/SDDP.jl/blob/0490bea2c46787e1d4d63a5491ea0106c7fe70cf/src/algorithm.jl#L780-L827\n\n\n\n\n\n","category":"function"},{"location":"apireference/#Visualize-data-and-results-1","page":"Reference","title":"Visualize data and results","text":"","category":"section"},{"location":"apireference/#","page":"Reference","title":"Reference","text":"HydroPowerModels.plotscenarios\nHydroPowerModels.plot_grid\nHydroPowerModels.plot_aggregated_results\nHydroPowerModels.plotresults\nHydroPowerModels.plot_bound","category":"page"},{"location":"apireference/#HydroPowerModels.plotscenarios","page":"Reference","title":"HydroPowerModels.plotscenarios","text":"plotscenarios(scen::Array{Float64,2}; savepath::String =\"\",\n    save::Bool = false, fileformat::String = \"png\", kwargs...)\n\nPlots a set of scenarios.\n\nParameters:\n\nscen        : Scenarios matrix (Stages x Scenarious).\nsave        : Bool to indicate if figure is to be saved.\nsavepath    : Path save figure.\nfileformat  : Figure file format.\nkwargs      : Aditional keyword arguments for plot function.\n\n\n\n\n\n","category":"function"},{"location":"apireference/#HydroPowerModels.plot_grid","page":"Reference","title":"HydroPowerModels.plot_grid","text":"HydroPowerModels.plot_grid(data::Dict;path=nothing,size_fig = [15cm, 15cm],node_label=false,nodelabeldist=4.5)\n\nPlot Grid installed Power.\n\nParemeters:\n\ndata         : HydroPowerModel single stage data.\npath         : Path to save grid plot.\nsize_fig     : Size figure.\nnode_label   : Plot nodel label on grid.\nnodelabeldist: Nodel label distance from node.\n\n\n\n\n\n","category":"function"},{"location":"apireference/#HydroPowerModels.plot_aggregated_results","page":"Reference","title":"HydroPowerModels.plot_aggregated_results","text":"HydroPowerModels.plot_aggregated_results(results::Dict)\n\nPlot Aggregated Results. Figures are of aggregated quantities, but the methods used to aggregate were chosen in order to help analysis. For example: The final nodal price is an average of nodal prices weighted by the contribution of local loads to the total demand; Reservoir volume was grouped weighted by the amount of energy that could be produced by the stored water (as was the inflow of water). \n\nParemeter:\n\nresults: Simulation results.\n\n\n\n\n\n","category":"function"},{"location":"apireference/#HydroPowerModels.plotresults","page":"Reference","title":"HydroPowerModels.plotresults","text":"HydroPowerModels.plotresults(results::Dict;nc::Int = 3)\n\nCommon Plots.\n\nParameters:\n\nresults        : Simulations output.\nnc             : Number of figures per line.\n\n\n\n\n\n","category":"function"},{"location":"apireference/#HydroPowerModels.plot_bound","page":"Reference","title":"HydroPowerModels.plot_bound","text":"HydroPowerModels.plot_bound(m)\n\nPlots the SDDP outer bound per iteration.\n\n\n\n\n\n","category":"function"}]
}
