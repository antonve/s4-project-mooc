// Generated by CoffeeScript 1.6.1
(function() {
  var _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.MarkdownEditingDescriptor = (function(_super) {

    __extends(MarkdownEditingDescriptor, _super);

    MarkdownEditingDescriptor.multipleChoiceTemplate = "( ) " + (gettext('incorrect')) + "\n( ) " + (gettext('incorrect')) + "\n(x) " + (gettext('correct')) + "\n";

    MarkdownEditingDescriptor.checkboxChoiceTemplate = "[x] " + (gettext('correct')) + "\n[ ] incorrect\n[x] correct\n";

    MarkdownEditingDescriptor.stringInputTemplate = "= " + (gettext('answer')) + "\n";

    MarkdownEditingDescriptor.numberInputTemplate = "= " + (gettext('answer')) + " +- 0.001%\n";

    MarkdownEditingDescriptor.selectTemplate = "[[" + (gettext('incorrect')) + ", (" + (gettext('correct')) + "), " + (gettext('incorrect')) + "]]\n";

    MarkdownEditingDescriptor.headerTemplate = "" + (gettext('Header')) + "\n=====\n";

    MarkdownEditingDescriptor.explanationTemplate = "[explanation]\n" + (gettext('Short explanation')) + "\n[explanation]\n";

    function MarkdownEditingDescriptor(element) {
      var _this = this;
      this.toggleCheatsheetVisibility = function() {
        return MarkdownEditingDescriptor.prototype.toggleCheatsheetVisibility.apply(_this, arguments);
      };
      this.toggleCheatsheet = function(e) {
        return MarkdownEditingDescriptor.prototype.toggleCheatsheet.apply(_this, arguments);
      };
      this.onToolbarButton = function(e) {
        return MarkdownEditingDescriptor.prototype.onToolbarButton.apply(_this, arguments);
      };
      this.onShowXMLButton = function(e) {
        return MarkdownEditingDescriptor.prototype.onShowXMLButton.apply(_this, arguments);
      };
      this.element = element;
      if ($(".markdown-box", this.element).length !== 0) {
        this.markdown_editor = CodeMirror.fromTextArea($(".markdown-box", element)[0], {
          lineWrapping: true,
          mode: null
        });
        this.setCurrentEditor(this.markdown_editor);
        this.element.on('click', '.xml-tab', this.onShowXMLButton);
        this.element.on('click', '.format-buttons a', this.onToolbarButton);
        this.element.on('click', '.cheatsheet-toggle', this.toggleCheatsheet);
        $(this.element.find('.xml-box')).hide();
      } else {
        this.createXMLEditor();
      }
    }

    /*
    Creates the XML Editor and sets it as the current editor. If text is passed in,
    it will replace the text present in the HTML template.
    
    text: optional argument to override the text passed in via the HTML template
    */


    MarkdownEditingDescriptor.prototype.createXMLEditor = function(text) {
      this.xml_editor = CodeMirror.fromTextArea($(".xml-box", this.element)[0], {
        mode: "xml",
        lineNumbers: true,
        lineWrapping: true
      });
      if (text) {
        this.xml_editor.setValue(text);
      }
      this.setCurrentEditor(this.xml_editor);
      $(this.xml_editor.getWrapperElement()).toggleClass("CodeMirror-advanced");
      return this.xml_editor.refresh();
    };

    /*
    User has clicked to show the XML editor. Before XML editor is swapped in,
    the user will need to confirm the one-way conversion.
    */


    MarkdownEditingDescriptor.prototype.onShowXMLButton = function(e) {
      e.preventDefault();
      if (this.cheatsheet && this.cheatsheet.hasClass('shown')) {
        this.cheatsheet.toggleClass('shown');
        this.toggleCheatsheetVisibility();
      }
      if (this.confirmConversionToXml()) {
        this.createXMLEditor(MarkdownEditingDescriptor.markdownToXml(this.markdown_editor.getValue()));
        this.xml_editor.setCursor(0);
        return $(this.element.find('.editor-bar')).hide();
      }
    };

    /*
    Have the user confirm the one-way conversion to XML.
    Returns true if the user clicked OK, else false.
    */


    MarkdownEditingDescriptor.prototype.confirmConversionToXml = function() {
      return confirm(gettext("If you use the Advanced Editor, this problem will be converted to XML and you will not be able to return to the Simple Editor Interface.\n\nProceed to the Advanced Editor and convert this problem to XML?"));
    };

    /*
    Event listener for toolbar buttons (only possible when markdown editor is visible).
    */


    MarkdownEditingDescriptor.prototype.onToolbarButton = function(e) {
      var revisedSelection, selection;
      e.preventDefault();
      selection = this.markdown_editor.getSelection();
      revisedSelection = null;
      switch ($(e.currentTarget).attr('class')) {
        case "multiple-choice-button":
          revisedSelection = MarkdownEditingDescriptor.insertMultipleChoice(selection);
          break;
        case "string-button":
          revisedSelection = MarkdownEditingDescriptor.insertStringInput(selection);
          break;
        case "number-button":
          revisedSelection = MarkdownEditingDescriptor.insertNumberInput(selection);
          break;
        case "checks-button":
          revisedSelection = MarkdownEditingDescriptor.insertCheckboxChoice(selection);
          break;
        case "dropdown-button":
          revisedSelection = MarkdownEditingDescriptor.insertSelect(selection);
          break;
        case "header-button":
          revisedSelection = MarkdownEditingDescriptor.insertHeader(selection);
          break;
        case "explanation-button":
          revisedSelection = MarkdownEditingDescriptor.insertExplanation(selection);
          break;
      }
      if (revisedSelection !== null) {
        this.markdown_editor.replaceSelection(revisedSelection);
        return this.markdown_editor.focus();
      }
    };

    /*
    Event listener for toggling cheatsheet (only possible when markdown editor is visible).
    */


    MarkdownEditingDescriptor.prototype.toggleCheatsheet = function(e) {
      var _this = this;
      e.preventDefault();
      if (!$(this.markdown_editor.getWrapperElement()).find('.simple-editor-cheatsheet')[0]) {
        this.cheatsheet = $($('#simple-editor-cheatsheet').html());
        $(this.markdown_editor.getWrapperElement()).append(this.cheatsheet);
      }
      this.toggleCheatsheetVisibility();
      return setTimeout((function() {
        return _this.cheatsheet.toggleClass('shown');
      }), 10);
    };

    /*
    Function to toggle cheatsheet visibility.
    */


    MarkdownEditingDescriptor.prototype.toggleCheatsheetVisibility = function() {
      return $('.modal-content').toggleClass('cheatsheet-is-shown');
    };

    /*
    Stores the current editor and hides the one that is not displayed.
    */


    MarkdownEditingDescriptor.prototype.setCurrentEditor = function(editor) {
      if (this.current_editor) {
        $(this.current_editor.getWrapperElement()).hide();
      }
      this.current_editor = editor;
      $(this.current_editor.getWrapperElement()).show();
      return $(this.current_editor).focus();
    };

    /*
    Called when save is called. Listeners are unregistered because editing the block again will
    result in a new instance of the descriptor. Note that this is NOT the case for cancel--
    when cancel is called the instance of the descriptor is reused if edit is selected again.
    */


    MarkdownEditingDescriptor.prototype.save = function() {
      this.element.off('click', '.xml-tab', this.changeEditor);
      this.element.off('click', '.format-buttons a', this.onToolbarButton);
      this.element.off('click', '.cheatsheet-toggle', this.toggleCheatsheet);
      if (this.current_editor === this.markdown_editor) {
        return {
          data: MarkdownEditingDescriptor.markdownToXml(this.markdown_editor.getValue()),
          metadata: {
            markdown: this.markdown_editor.getValue()
          }
        };
      } else {
        return {
          data: this.xml_editor.getValue(),
          nullout: ['markdown']
        };
      }
    };

    MarkdownEditingDescriptor.insertMultipleChoice = function(selectedText) {
      return MarkdownEditingDescriptor.insertGenericChoice(selectedText, '(', ')', MarkdownEditingDescriptor.multipleChoiceTemplate);
    };

    MarkdownEditingDescriptor.insertCheckboxChoice = function(selectedText) {
      return MarkdownEditingDescriptor.insertGenericChoice(selectedText, '[', ']', MarkdownEditingDescriptor.checkboxChoiceTemplate);
    };

    MarkdownEditingDescriptor.insertGenericChoice = function(selectedText, choiceStart, choiceEnd, template) {
      var cleanSelectedText, line, lines, revisedLines, _i, _len;
      if (selectedText.length > 0) {
        cleanSelectedText = selectedText.replace(/\n+/g, '\n').replace(/\n$/, '');
        lines = cleanSelectedText.split('\n');
        revisedLines = '';
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          revisedLines += choiceStart;
          if (/^\s*x\s+(\S)/i.test(line)) {
            line = line.replace(/^\s*x\s+(\S)/i, '$1');
            revisedLines += 'x';
          } else {
            revisedLines += ' ';
          }
          revisedLines += choiceEnd + ' ' + line + '\n';
        }
        return revisedLines;
      } else {
        return template;
      }
    };

    MarkdownEditingDescriptor.insertStringInput = function(selectedText) {
      return MarkdownEditingDescriptor.insertGenericInput(selectedText, '= ', '', MarkdownEditingDescriptor.stringInputTemplate);
    };

    MarkdownEditingDescriptor.insertNumberInput = function(selectedText) {
      return MarkdownEditingDescriptor.insertGenericInput(selectedText, '= ', '', MarkdownEditingDescriptor.numberInputTemplate);
    };

    MarkdownEditingDescriptor.insertSelect = function(selectedText) {
      return MarkdownEditingDescriptor.insertGenericInput(selectedText, '[[', ']]', MarkdownEditingDescriptor.selectTemplate);
    };

    MarkdownEditingDescriptor.insertHeader = function(selectedText) {
      return MarkdownEditingDescriptor.insertGenericInput(selectedText, '', '\n====\n', MarkdownEditingDescriptor.headerTemplate);
    };

    MarkdownEditingDescriptor.insertExplanation = function(selectedText) {
      return MarkdownEditingDescriptor.insertGenericInput(selectedText, '[explanation]\n', '\n[explanation]', MarkdownEditingDescriptor.explanationTemplate);
    };

    MarkdownEditingDescriptor.insertGenericInput = function(selectedText, lineStart, lineEnd, template) {
      if (selectedText.length > 0) {
        return lineStart + selectedText + lineEnd;
      } else {
        return template;
      }
    };

    MarkdownEditingDescriptor.markdownToXml = function(markdown) {
      var toXml;
      toXml = function (markdown) {
      var xml = markdown,
          i, splits, scriptFlag;

      // replace headers
      xml = xml.replace(/(^.*?$)(?=\n\=\=+$)/gm, '<h1>$1</h1>');
      xml = xml.replace(/\n^\=\=+$/gm, '');

      // group multiple choice answers
      xml = xml.replace(/(^\s*\(.{0,3}\).*?$\n*)+/gm, function(match, p) {
        var choices = '';
        var shuffle = false;
        var options = match.split('\n');
        for(var i = 0; i < options.length; i++) {
          if(options[i].length > 0) {
            var value = options[i].split(/^\s*\(.{0,3}\)\s*/)[1];
            var inparens = /^\s*\((.{0,3})\)\s*/.exec(options[i])[1];
            var correct = /x/i.test(inparens);
            var fixed = '';
            if(/@/.test(inparens)) {
              fixed = ' fixed="true"';
            }
            if(/!/.test(inparens)) {
              shuffle = true;
            }
            choices += '    <choice correct="' + correct + '"' + fixed + '>' + value + '</choice>\n';
          }
        }
        var result = '<multiplechoiceresponse>\n';
        if(shuffle) {
          result += '  <choicegroup type="MultipleChoice" shuffle="true">\n';
        } else {
          result += '  <choicegroup type="MultipleChoice">\n';
        }
        result += choices;
        result += '  </choicegroup>\n';
        result += '</multiplechoiceresponse>\n\n';
        return result;
      });

      // group check answers
      xml = xml.replace(/(^\s*\[.?\].*?$\n*)+/gm, function(match) {
          var groupString = '<choiceresponse>\n',
              options, value, correct;

          groupString += '  <checkboxgroup direction="vertical">\n';
          options = match.split('\n');

          for (i = 0; i < options.length; i += 1) {
              if(options[i].length > 0) {
                  value = options[i].split(/^\s*\[.?\]\s*/)[1];
                  correct = /^\s*\[x\]/i.test(options[i]);
                  groupString += '    <choice correct="' + correct + '">' + value + '</choice>\n';
              }
          }

          groupString += '  </checkboxgroup>\n';
          groupString += '</choiceresponse>\n\n';

          return groupString;
      });

      // replace string and numerical
      xml = xml.replace(/(^\=\s*(.*?$)(\n*or\=\s*(.*?$))*)+/gm, function(match, p) {
          // Split answers
          var answersList = p.replace(/^(or)?=\s*/gm, '').split('\n'),

              processNumericalResponse = function (value) {
                  var params, answer, string;

                  if (_.contains([ '[', '(' ], value[0]) && _.contains([ ']', ')' ], value[value.length-1]) ) {
                    // [5, 7) or (5, 7), or (1.2345 * (2+3), 7*4 ]  - range tolerance case
                    // = (5*2)*3 should not be used as range tolerance
                    string = '<numericalresponse answer="' + value +  '">\n';
                    string += '  <formulaequationinput />\n';
                    string += '</numericalresponse>\n\n';
                    return string;
                  }

                  if (isNaN(parseFloat(value))) {
                      return false;
                  }

                  // Tries to extract parameters from string like 'expr +- tolerance'
                  params = /(.*?)\+\-\s*(.*?$)/.exec(value);

                  if(params) {
                      answer = params[1].replace(/\s+/g, ''); // support inputs like 5*2 +- 10
                      string = '<numericalresponse answer="' + answer + '">\n';
                      string += '  <responseparam type="tolerance" default="' + params[2] + '" />\n';
                  } else {
                      answer = value.replace(/\s+/g, ''); // support inputs like 5*2
                      string = '<numericalresponse answer="' + answer + '">\n';
                  }

                  string += '  <formulaequationinput />\n';
                  string += '</numericalresponse>\n\n';

                  return string;
              },

              processStringResponse = function (values) {
                  var firstAnswer = values.shift(), string;

                  if (firstAnswer[0] === '|') { // this is regexp case
                      string = '<stringresponse answer="' + firstAnswer.slice(1).trim() +  '" type="ci regexp" >\n';
                  } else {
                      string = '<stringresponse answer="' + firstAnswer +  '" type="ci" >\n';
                  }

                  for (i = 0; i < values.length; i += 1) {
                      string += '  <additional_answer>' + values[i] + '</additional_answer>\n';
                  }

                  string +=  '  <textline size="20"/>\n</stringresponse>\n\n';

                  return string;
              };

          return processNumericalResponse(answersList[0]) || processStringResponse(answersList);
      });

      // replace selects
      xml = xml.replace(/\[\[(.+?)\]\]/g, function(match, p) {
          var selectString = '\n<optionresponse>\n',
              correct, options;

          selectString += '  <optioninput options="(';
          options = p.split(/\,\s*/g);

          for (i = 0; i < options.length; i += 1) {
              selectString += "'" + options[i].replace(/(?:^|,)\s*\((.*?)\)\s*(?:$|,)/g, '$1') + "'" + (i < options.length -1 ? ',' : '');
          }

          selectString += ')" correct="';
          correct = /(?:^|,)\s*\((.*?)\)\s*(?:$|,)/g.exec(p);

          if (correct) {
              selectString += correct[1];
          }

          selectString += '"></optioninput>\n';
          selectString += '</optionresponse>\n\n';

          return selectString;
      });

      // replace explanations
      xml = xml.replace(/\[explanation\]\n?([^\]]*)\[\/?explanation\]/gmi, function(match, p1) {
          var selectString = '<solution>\n<div class="detailed-solution">\nExplanation\n\n' + p1 + '\n</div>\n</solution>';

          return selectString;
      });
      
      // replace labels
      // looks for >>arbitrary text<< and inserts it into the label attribute of the input type directly below the text. 
      var split = xml.split('\n');
      var new_xml = [];
      var line, i, curlabel, prevlabel = '';
      var didinput = false;
      for (i = 0; i < split.length; i++) {
        line = split[i];
        if (match = line.match(/>>(.*)<</)) {
          curlabel = match[1].replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
          line = line.replace(/>>|<</g, '');
        } else if (line.match(/<\w+response/) && didinput && curlabel == prevlabel) {
          // reset label to prevent gobbling up previous one (if multiple questions)
          curlabel = '';
          didinput = false;
        } else if (line.match(/<(textline|optioninput|formulaequationinput|choicegroup|checkboxgroup)/) && curlabel != '' && curlabel != undefined) {
          line = line.replace(/<(textline|optioninput|formulaequationinput|choicegroup|checkboxgroup)/, '<$1 label="' + curlabel + '"');
          didinput = true;
          prevlabel = curlabel;
        }
        new_xml.push(line);
      }
      xml = new_xml.join('\n');

      // replace code blocks
      xml = xml.replace(/\[code\]\n?([^\]]*)\[\/?code\]/gmi, function(match, p1) {
          var selectString = '<pre><code>\n' + p1 + '</code></pre>';

          return selectString;
      });

      // split scripts and preformatted sections, and wrap paragraphs
      splits = xml.split(/(\<\/?(?:script|pre).*?\>)/g);
      scriptFlag = false;

      for (i = 0; i < splits.length; i += 1) {
          if(/\<(script|pre)/.test(splits[i])) {
              scriptFlag = true;
          }

          if(!scriptFlag) {
              splits[i] = splits[i].replace(/(^(?!\s*\<|$).*$)/gm, '<p>$1</p>');
          }

          if(/\<\/(script|pre)/.test(splits[i])) {
              scriptFlag = false;
          }
      }

      xml = splits.join('');

      // rid white space
      xml = xml.replace(/\n\n\n/g, '\n');

      // surround w/ problem tag
      xml = '<problem>\n' + xml + '\n</problem>';

      return xml;
    };
      return toXml(markdown);
    };

    return MarkdownEditingDescriptor;

  })(XModule.Descriptor);

}).call(this);