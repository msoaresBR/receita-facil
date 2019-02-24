// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/promocoes',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(farmacia, medicamento, descricao, link) {
            let ajax_options = {
                type: 'POST',
                url: 'api/promocoes',
                accepts: 'application/json',
                contentType: 'application/json',
                //dataType: 'json',
                data: JSON.stringify({
                    'farmacia': farmacia,
                    'medicamento': medicamento,
                    'descricao': descricao,
                    'link': link
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(farmacia, medicamento, descricao, link) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/promocoes/' + descricao,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'farmacia': farmacia,
                    'medicamento': medicamento,
                    'descricao': descricao,
                    'link': link
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(descricao) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/promocoes/' + descricao,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $farmacia = $('#farmacia'),
        $medicamento = $('#medicamento'),
        $descricao = $('#descricao'),
        $link = $('#link');

    // return the API
    return {
        reset: function() {
            $descricao.val('');
            $farmacia.val('').focus();
        },
        update_editor: function(farmacia, medicamento, descricao, link) {
            $descricao.val(descricao);
            $farmacia.val(farmacia).focus();
        },
        build_table: function(promocoes) {
            let rows = ''

            // clear the table
            $('.promocoes table > tbody').empty();

            // did we get a promocoes array?
            if (promocoes) {
                for (let i=0, l=promocoes.length; i < l; i++) {
                    rows += `<tr><td class="farmacia">${promocoes[i].farmacia}</td><td class="medicamento">${promocoes[i].medicamento}</td><td class="descricao">${promocoes[i].descricao}</td><td class="link">${promocoes[i].link}</td><td>${promocoes[i].dataInicio}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $farmacia = $('#farmacia'),
        $medicamento = $('#medicamento'),
        $descricao = $('#descricao'),
        $link = $('#link');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(farmacia, medicamento, descricao, link) {
        return farmacia !== "" && medicamento !== "" && descricao !== "" && link !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let farmacia = $farmacia.val(),
            medicamento = $medicamento.val(),
            descricao = $descricao.val(),
            link = $link.val();

        e.preventDefault();

        if (validate(farmacia, medicamento, descricao, link)) {
            model.create(farmacia, medicamento, descricao, link)
        } else {
            alert('Problemas com as informacoes da promocao');
        }
    });

    $('#update').click(function(e) {
        let farmacia = $farmacia.val(),
            medicamento = $medicamento.val(),
            descricao = $descricao.val(),
            link = $link.val();

        e.preventDefault();

        if (validate(farmacia, medicamento, descricao, link)) {
            model.update(farmacia, medicamento, descricao, link)
        } else {
            alert('Problemas com as informacoes da promocao');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let descricao = $descricao.val();

        e.preventDefault();

        if (validate('placeholder', descricao)) {
            model.delete(descricao)
        } else {
            alert('Problemas com as informacoes da promocao');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        //location.reload();
        //model.read();
        window.location.reload();
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            farmacia,
            medicamento,
            descricao,
            link;

        farmacia = $target
            .parent()
            .find('td.farmacia')
            .text();
            
        medicamento = $target
            .parent()
            .find('td.medicamento')
            .text();            

        descricao = $target
            .parent()
            .find('td.descricao')
            .text();
            
        link = $target
            .parent()
            .find('td.link')
            .text();            

        view.update_editor(farmacia, medicamento, descricao, link);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = "Msg de Erro:" + textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
