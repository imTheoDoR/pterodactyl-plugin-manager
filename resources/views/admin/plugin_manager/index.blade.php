@extends('layouts.admin')

@section('title')
    Plugin manager
@endsection

@section('content-header')
    <h1>Plugin manager<small>Choose eggs where the plugin manager should be visible.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Plugin manager</li>
    </ol>
@endsection

@section('content')
<div class="container">
    <form method="POST" action="{{ route('admin.plugin_manager.update') }}" class="box box-primary">
        @csrf

        <div class="box-body table-responsive">
            @foreach ($eggs->chunk(ceil($eggs->count() / 3)) as $chunk)
                <div class="col-md-4">
                    @foreach ($chunk as $egg)
                        <div>
                            <label class="egg_box">
                                <input type="hidden" name="eggs[{{ $egg->id }}]" value="false" />

                                <input
                                    type="checkbox"
                                    name="eggs[{{ $egg->id }}]"
                                    value="true"
                                    {{ isset($config[$egg->id]) && $config[$egg->id] ? 'checked' : '' }}
                                />
                                {{ $egg->name }} <small class="text-muted">(ID: {{ $egg->id }})</small>
                            </label>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>

        <div class="plman-btn">
            <button class="btn btn-primary">Save</button>
        </div>
    </form>
</div>
@endsection