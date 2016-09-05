(function() { // This prevents problems when concatenating scripts that aren't strict.
    'use strict';

    var project = {
        name: 'KNALLEDGE',
        port: 8000,
        subProjects: {
            KNALLEDGE: {
                BOOTSTRAP_MODULE: 'js/app2',
                BOOTSTRAP_MODULE_HOT_LOADER: 'hot_loader_app2',
                SELECTOR: 'button-basic-usage',
                APP_SRC: 'app',
                DEV_PUZZLES_SRC: 'dev_puzzles',
                DEV_PUZZLES: 'dev_puzzles',
                APP_TITLE: 'KnAllEdge',
                COMPILATION: {},
                SYM_LINKS_EXISTS: false
            }
        }
    }

    var APP_SRC = project.subProjects.KNALLEDGE.APP_SRC;
    var APP_DEST = 'APP_DEST';

    var APP_SRC_STR = 'APP_SRC_STR';
    var APP_DEST_STR = 'APP_DEST_STR';

    project.subProjects.KNALLEDGE.COMPILATION = {
        ADD_ANTICACHE_SUFIX: false,
        INLINE_NG1: {
            SRC: project.subProjects.KNALLEDGE.SYM_LINKS_EXISTS ?
                // this does work for symbolic links
                ['**/*.tpl.html'] :
                // this doesn't work for symbolic links
                [
                    [APP_SRC_STR, '**/*.tpl.html']
                ]
        },
        INLINE: {
            USE_RELATIVE_PATHS: true
        },
        COMPASS: {
            // NOTE: !!!if true, this will output css files into sass folder!!!
            // due to [issue-61](https://github.com/appleboy/gulp-compass/issues/61)
            GENERIC: false,
            // if value of the path key is not set to object, default values will be considered
            PATHS: {
                '': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/collaboPlugins': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                // 'components/demoPuzzle': {
                // 	destDir: APP_SRC,
                // 	cssDir: 'css'
                // }
                'components/change': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/knalledgeMap': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/login': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/notify': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/gardening': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/ontov': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/rima': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/brainstorming': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/bottomPanel': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/topPanel': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/request': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/topiChat': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/mapsList': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/suggestion': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                },
                'components/session': {
                    destDir: APP_SRC,
                    cssDir: 'css'
                }
            }
        }
    };

    /* Configuration */
    var plugins = {
        "ViewComponents": {
            "knalledgeMap.Main": {
                components: {
                    TopPanel: {
                        active: true,
                        path: "/components/topPanel/topPanel"
                    },
                    'ontov.OntovComponent': {
                        active: true,
                        path: "/components/ontov/ontov.component"
                    },
                    'brainstorming.BrainstormingFormComponent': {
                        active: true,
                        path: "/components/brainstorming/brainstorming-form.component"
                    },
                    'session.SessionFormComponent': {
                        active: true,
                        path: "/components/session/session-form.component"
                    }
                }
            },

            "bottomPanel.BottomPanel": {
                components: {
                    'brainstorming.BrainstormingPanelComponent': {
                        active: true,
                        path: "/components/brainstorming/brainstorming-panel.component"
                    },
                    'cf.puzzles.presentation.list': {
                        active: true,
                        path: "cf.puzzles.presentation.list"
                    },
                }
            },
            "knalledgeMap.KnalledgeMapTools": {
                components: {
                    GardeningControls: {
                        active: true,
                        path: "/components/gardening/gardening-controls.component"
                    },
                    RimaUsersList: {
                        active: true,
                        path: "/components/rima/rimaUsersList"
                    },
                    IbisTypesList: {
                        active: true,
                        path: "cf.puzzles.ibis.typesList"
                    },
                }
            }
        },
        puzzlesBuild: {
            knalledgeMap: {
                directive: {
                    path: [APP_SRC_STR, 'components/knalledgeMap'],
                    injectJs: [
                        'js/directives.js', 'js/services.js'
                    ],
                    injectCss: ['css/default.css', 'css/graph.css']
                },
                interaction: {
                    path: [APP_SRC_STR, 'js/interaction'],
                    injectJs: ['interaction.js', 'moveAndDrag.js', 'keyboard.js']
                },
                knalledge: {
                    path: [APP_SRC_STR, 'js/knalledge'],
                    injectJs: ['mapLayout.js', 'mapVisualization.js', 'mapLayoutTree.js', 'mapVisualizationTree.js', 'mapLayoutFlat.js', 'mapVisualizationFlat.js', 'mapLayoutGraph.js', 'mapVisualizationGraph.js', 'mapManager.js', 'map.js']
                }
            },

            // demoPuzzle: {
            // 	path: [APP_SRC_STR, 'components/demoPuzzle'],
            // 	injectJs: ['demoPuzzles.js', 'js/services.js'],
            // 	injectCss: 'css/demoPuzzle.css'
            // },

            collaboPlugins: {
                path: [APP_SRC_STR, 'components/collaboPlugins'],
                injectJs: ['js/directives.js', 'js/services.js'],
                injectCss: 'css/default.css'
            },
            rima: {
                path: [APP_SRC_STR, 'components/rima'],
                injectJs: ['js/directives.js', 'js/services.js', 'js/filters.js'],
                injectCss: 'css/default.css'
            },

            notify: {
                path: [APP_SRC_STR, 'components/notify'],
                injectJs: ['js/directives.js', 'js/services.js'],
                injectCss: 'css/default.css'
            },

            topiChat: {
                path: [APP_SRC_STR, 'components/topiChat'],
                injectJs: ['js/directives.js', 'js/services.js'],
                injectCss: 'css/default.css'
            },

            request: {
                path: [APP_SRC_STR, 'components/request'],
                injectJs: 'services.js',
                injectCss: 'css/request.component.css'
            },

            suggestion: {
                path: [APP_SRC_STR, 'components/suggestion'],
                injectJs: 'services.js',
                injectCss: 'css/suggestion.component.css'
            },
            bottomPanel: {
                path: [APP_SRC_STR, 'components/bottomPanel'],
                injectJs: [],
                injectCss: 'css/bottomPanel.css'
            },
            topPanel: {
                path: [APP_SRC_STR, 'components/topPanel'],
                injectJs: [],
                injectCss: 'css/topPanel.css'
            },
            change: {
                path: [APP_SRC_STR, 'components/change'],
                injectJs: ['changes.js', 'services.js'],
                injectCss: 'css/change.component.css'
            },
            login: {
                path: [APP_SRC_STR, 'components/login'],
                injectJs: ['js/directives.js', 'js/services.js'],
                injectCss: 'css/default.css'
            },
            ontov: {
                path: [APP_SRC_STR, 'components/ontov'],
                injectJs: [
                    'js/vendor/underscore-1.8.3.min.js',
                    'js/vendor/backbone-1.1.2.min.js',
                    'js/vendor/query-engine.js',
                    'js/vendor/dependencies.js',
                    'js/vendor/visualsearch.js'
                ],
                injectCss: ['css/default.css', 'css/visualsearch/visualsearch-datauri.css']
            },

            mcMap: {
                path: [APP_SRC_STR, 'js/mcm'],
                injectJs: ['mcm.js', 'map.js', 'entitiesToolset.js']
            },
            mapsList: {
                path: [APP_SRC_STR, 'components/mapsList'],
                injectJs: 'css/maps-list.component.css'
            },

            brainstorming: {
                path: [APP_SRC_STR, 'components/brainstorming'],
                injectJs: ['brainstormings.js', 'js/services.js'],
                injectCss: 'css/brainstorming.component.css'
            },

            session: {
                path: [APP_SRC_STR, 'components/session'],
                injectJs: ['sessions.js', 'js/services.js'],
                injectCss: 'css/session.css'
            },

            gardening: {
                path: [APP_SRC_STR, 'components/gardening'],
                css: true,
                // { src: join('components/gardening/js/services.js'), inject: true, noNorm: true },

                // SUB_PROJECTS_FILES.KNALLEDGE.APP_ASSETS.NPM_DEPENDENCIES
                injectJs: 'js/services.js',
                // { src: join(APP_SRC, 'components/gardening/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
                injectCss: 'css/default.css'
            }
        },
        puzzles: {
            knalledgeMap: {
                active: true,
                config: {
                    knalledgeMapVOsService: {
                        // should map participants be broadcasted after loading map
                        broadcastMapUsers: true
                    },
                    knAllEdgeRealTimeService: {
                        available: true
                    }
                }
            },
            collaboPlugins: {
              active: true
            },
            topPanel: {
                active: true,
                config: {
                    suggestion: {
                        available: false
                    },
                    request: {
                        available: false
                    },
                }
            },
            change: {
              active: true
            },
            login: {
              active: true
            },
            mapsList: {
                active: true,
                config: {
                    title: 'CollaboFramework',
                    //map_path,
                    //
                    openMap: {
                        routes: [{
                            route: 'map',
                            name: 'map',
                            icon: ''
                        }]
                    }
                }
            },
            ontov: {
                active: true
            },
            mcMap: {
                active: true
            },
            topiChat: {
                active: true
            },
            rima: {
                active: true,
                config: {
                    rimaService: {
                        available: true,
                        ANONYMOUS_USER_ID: "55268521fb9a901e442172f8",
                        // should the service wait for users be broadcasted from other components
                        // (like KnalledgeMapVOsService) or request loading all of them?
                        waitToReceiveRimaList: true
                    }
                }
            },
            request: {
                active: true,
                services: {
                    requestService: {
                        name: 'RequestService',
                        path: 'request.RequestService'
                            // icons: {
                            // 	showRequests: {
                            // 		position: "nw",
                            // 		iconClass: "fa-bell",
                            // 		action: "showRequests"
                            // 	}
                            // }
                    }
                },
                plugins: {
                    mapVisualizeHaloPlugins: ['requestService'],
                    // mapInteractionPlugins: ['requestService'],
                    keboardPlugins: ['requestService']
                }
            },
            notify: {
                active: true,
                services: {
                    NotifyNodeService: {}
                },
                plugins: {
                    mapVisualizePlugins: ['NotifyNodeService']
                }
            },
            collaboGrammar: {
                active: true,
                config: {
                    collaboGrammarService: {
                        available: true
                    }
                }
            },
            gardening: {
                active: true,
                services: {
                    ApprovalNodeService: {}
                },
                plugins: {
                    mapVisualizePlugins: ['ApprovalNodeService']
                }
            },
            suggestion: {
              active: true
            },
            bottomPanel: {
              active: true
            },
            brainstorming: {
                active: true,
                services: {
                    BrainstormingService: {}
                },
                plugins: {
                    mapVisualizePlugins: ['BrainstormingService']
                }
            },
            session: {
              active: true
            },
            ibis: {
                active: true, // is active puzzle
                path: 'dev_puzzles/ibis' // path to the puzzle folder, relative to the project (frontend) root
            },
            editors: {
                active: true, // is active puzzle
                path: 'dev_puzzles/editors' // path to the puzzle folder, relative to the project (frontend) root
            },
            presentation: {
                active: true, // is active puzzle
                path: 'dev_puzzles/presentation' // path to the puzzle folder, relative to the project (frontend) root
            },
        }
    };


    if (typeof window !== 'undefined') {
        if (typeof window.Config === 'undefined') window.Config = {};
        window.Config.Plugins = plugins;
    }

    if (typeof angular !== 'undefined') {
        angular.module('Config')
            .constant("Plugins", plugins);
    }

    if (typeof global !== 'undefined') {
        if (typeof global.Config === 'undefined') global.Config = {};
        global.Config.Plugins = plugins;
    }

    // node.js world
    if (typeof module !== 'undefined') {
        module.exports = (function() {
            return {
                plugins: plugins,
                project: project
            };
        })();
    }

}()); // end of 'use strict';
