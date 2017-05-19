/*
 * Copyright 2013, All Rights Reserved.
 *
 * Code licensed under the BSD License:
 * https://github.com/morriswchris/dotfiles/blob/master/LICENSE.md
 *
 * @author Chris Morris <morriswchris@gmail.com>
 */

'use strict';

var userhome = require('userhome');

var choicesDock = require('./templates/.osx-dock');
var choicesFinder = require('./templates/.osx-finder');
var choicesGeneral = require('./templates/.osx-general');
var choicesIterm = require('./templates/.osx-iterm');
var choicesTrackpad = require('./templates/.osx-trackpad');
var brew_packages = ["cask", "git-extras", "htop", "openssl", "tmux", "tree", "wget", "zsh"];
var brew_cask_packages = ["atom", "iterm2"];
var atom_packages = ["aligner",
  "atom-dark-syntax",
  "atom-dark-ui",
  "atom-handlebars",
  "atom-jade",
  "atom-light-syntax",
  "atom-light-ui",
  "atom-material-syntax",
  "atom-material-ui",
  "change-case",
  "easy-motion-redux",
  "file-icons",
  "formatter",
  "gist",
  "jsformat",
  "jshint",
  "language-haml",
  "language-pug",
  "language-scala",
  "linter",
  "linter-haml",
  "linter-ruby",
  "linter-scalac",
  "linter-scss-lint",
  "maximize-panes",
  "merge-conflicts",
  "pain-split",
  "pigments",
  "pinned-tabs",
  "release-notes",
  "ruby-block",
  "sort-lines",
  "symbol-gen",
  "sync-settings",
  "tasks",
  "time-status",
  "vim-mode",
  "vim-mode-plus",
  "vim-mode-plus-ex-mode"
];


function copyConfigChoicesAsBooleans(config, choices, from, to) {
    choices.forEach(function(choice) {
        config[to][choice.value] =
            config.choices[from].indexOf(choice.value) > -1;
    });
}

module.exports = function(grunt) {

    grunt.initConfig({

        // -- Bump -------------------------------------------------------------

        bump: {

            options: {
                commit: true,
                commitFiles: ['package.json'],
                commitMessage: 'Release v%VERSION%',
                createTag: true,
                files: ['package.json'],
                push: true,
                pushTo: 'origin',
                tagMessage: '',
                tagName: 'v%VERSION%'
            }

        },

        // -- Config -----------------------------------------------------------

        config: {

            aliases: {
                path_aliases: userhome('.dotfiles/.aliases')
            },

            git: {
                path_gitconfig: userhome('.dotfiles/.gitconfig'),
                path_gitconfig_system: userhome('.gitconfig'),
                path_gitignore: userhome('.dotfiles/.gitignore_global'),
                path_gitignore_system: userhome('.gitignore_global')
            },

            osx: {
                path_osx: userhome('.dotfiles/.osx')
            },

            themes: {
                path_natural: userhome('.dotfiles/themes/natural'),
                path_iterm_ocean: userhome('.dotfiles/themes/iterm')
            },

            vim: {
                path_vimrc: userhome('.dotfiles/.vimrc'),
                path_vimrc_system: userhome('.vimrc.after')
            },

            zsh: {
                path_oh_my_zsh: userhome('.dotfiles/.oh-my-zsh'),
                path_theme_natural: userhome('.dotfiles/.oh-my-zsh/themes/natural.zsh-theme'),
                path_zshrc: userhome('.dotfiles/.zshrc'),
                path_zshrc_system: userhome('.zshrc')
            }

        },

        // -- Prompt -----------------------------------------------------------

        prompt: {

            config: {
                options: {
                    questions: [
                        {
                            config: 'config.osx.computername',
                            default: 'richard',
                            message: 'Which computer name would you like to use?'
                        },
                        {
                            config: 'config.git.name',
                            default: 'Chris Morris',
                            message: 'Which Git name would you like to use?'
                        },
                        {
                            config: 'config.git.email',
                            default: 'morriswchris@gmail.com',
                            message: 'Which Git email would you like to use?'
                        },
                        {
                            config: 'config.editor',
                            default: 'vim',
                            message: 'Which editor would you like to use?'
                        },
                        {
                            config: 'config.zsh.plugins',
                            default: 'git git-extras history history-substring-search jsontools ssh-agent sudo',
                            message: 'Which Oh My Zsh plugins would you like to use?'
                        },
                        {
                            config: 'config.zsh.theme_oh_my_zsh',
                            default: 'natural',
                            message: 'Which Oh My Zsh theme would you like to use?'
                        },
                        {
                            choices: choicesGeneral,
                            config: 'config.choices.general',
                            message: 'Which OSX general options would you like to use?',
                            type: 'checkbox'
                        },
                        {
                            choices: choicesDock,
                            config: 'config.choices.dock',
                            message: 'Which Dock options would you like to use?',
                            type: 'checkbox'
                        },
                        {
                            choices: choicesFinder,
                            config: 'config.choices.finder',
                            message: 'Which Finder options would you like to use?',
                            type: 'checkbox'
                        },
                        {
                            choices: choicesIterm,
                            config: 'config.choices.iterm',
                            message: 'Which iTerm options would you like to use?',
                            type: 'checkbox'
                        },
                        {
                            choices: choicesTrackpad,
                            config: 'config.choices.trackpad',
                            message: 'Which Trackpad options would you like to use?',
                            type: 'checkbox'
                        }
                    ]
                }
            }

        },

        // -- Clean ------------------------------------------------------------

        clean: {

            all: {
                options: {
                    force: true
                },
                src: [
                    userhome('.dotfiles')
                ]
            }

        },

        // -- Templates --------------------------------------------------------

        template: {

            aliases: {
                options: {
                    data: '<%= config %>'
                },
                files: {
                    '<%= config.aliases.path_aliases %>': ['templates/.aliases']
                }
            },

            git: {
                options: {
                    data: '<%= config %>'
                },
                files: {
                    '<%= config.git.path_gitconfig %>': ['templates/.gitconfig'],
                    '<%= config.git.path_gitignore %>': ['templates/.gitignore_global']
                }
            },

            osx: {
                options: {
                    data: function() {
                        var config = grunt.config.data.config;
                        copyConfigChoicesAsBooleans(config, choicesDock, 'dock', 'osx');
                        copyConfigChoicesAsBooleans(config, choicesFinder, 'finder', 'osx');
                        copyConfigChoicesAsBooleans(config, choicesGeneral, 'general', 'osx');
                        copyConfigChoicesAsBooleans(config, choicesIterm, 'iterm', 'osx');
                        copyConfigChoicesAsBooleans(config, choicesTrackpad, 'trackpad', 'osx');
                        return config;
                    }
                },
                files: {
                    '<%= config.osx.path_osx %>': ['templates/.osx']
                }
            },

            vim: {
                options: {
                    data: '<%= config %>'
                },
                files: {
                    '<%= config.vim.path_vimrc %>': ['templates/.vimrc']
                }
            },

            zsh: {
                options: {
                    data: '<%= config %>'
                },
                files: {
                    '<%= config.zsh.path_zshrc %>': ['templates/.zshrc']
                }
            }

        },

        // -- Git --------------------------------------------------------------

        gitclone: {

            oh_my_zsh: {
                options: {
                    directory: '<%= config.zsh.path_oh_my_zsh %>',
                    repository: 'https://github.com/robbyrussell/oh-my-zsh.git'
                }
            },

            theme_natural: {
                options: {
                    directory: '<%= config.themes.path_natural %>',
                    repository: 'https://github.com/morriswchris/natural.git'
                }
            }
        },

        // -- Symbolic links ---------------------------------------------------

        symlink: {

            git_config: {
                dest: '<%= config.git.path_gitconfig_system %>',
                relativeSrc: '<%= config.git.path_gitconfig %>'
            },

            git_ignore: {
                dest: '<%= config.git.path_gitignore_system %>',
                relativeSrc: '<%= config.git.path_gitignore %>'
            },

            zsh: {
                dest: '<%= config.zsh.path_zshrc_system %>',
                relativeSrc: '<%= config.zsh.path_zshrc %>'
            },

            vim: {
                dest: '<%= config.vim.path_vimrc_system %>',
                relativeSrc: '<%= config.vim.path_vimrc %>'
            },

            zsh_theme_natural: {
                dest: '<%= config.zsh.path_theme_natural %>',
                relativeSrc: '<%= config.themes.path_natural %>/zsh/natural.zsh-theme'
            }

        },

        // -- Exec -------------------------------------------------------------

        shell: {

            osx: {
                command: 'source <%= config.osx.path_osx %>',
                options: {
                    stdout: true,
                    stderr: true
                }
            },

            zsh: {
                command: 'chsh -s /bin/zsh',
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            theme_iterm: {
                command: '[ -d "/Applications/iTerm.app" ] && open <%= config.themes.path_iterm_ocean %>/ocean-base16.itermcolors || echo "iTerm App is not installed"',
                options: {
                     stdout: true,
                     stderr: true
                }
            },
            brew: {
                command: 'ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"',
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            brew_package: {
                command: 'brew install ' + brew_packages.join(" "),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            brew_cask_package: {
                command: 'brew cask install ' + brew_packages.join(" "),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            apm_package: {
                command: 'apm install ' + atom_packages.join(" "),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            vim: {
              command: "curl -L https://bit.ly/janus-bootstrap | bash",
              options: {
                stdout: true,
                stderr: true
              }
            }
        }

    });

    grunt.task.registerTask('banner', function() {
        console.log(grunt.file.read('templates/.banner'));
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-symlink');
    grunt.loadNpmTasks('grunt-template');

    grunt.registerTask('setup', ['banner', 'prompt', 'clean', 'template', 'gitclone', 'shell', 'symlink']);

};
