import React, { Component } from 'react';
import { Terminal } from 'xterm';
import { TreeSelect, Button, message } from 'antd';
import { getFolder } from '@/services/file';
import styles from './index.less';

class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
            treeData: [],
            isBuilding: false, // 是否正在构建
        };
    }

    /**
     * 获取文件夹目录
     */
    getFolder(base = '/') {
        getFolder({
            base,
        }).then(res => {
            const { list, svnBase } = res.data.data;
            this.setState({
                treeData: this.state.treeData.concat(list),
                value: svnBase,
            });
        });
    }

    /**
     * 异步加载数据
     */
    onLoadData = treeNode => new Promise(resolve => {
        const { id } = treeNode.props;
        getFolder({
            base: id,
        }).then(res => {
            this.setState({
                treeData: this.state.treeData.concat(res.data.data.list),
            }, () => resolve());
        });
    })

    onChange = value => {
        this.setState({ value });
    };

    /**
     * 发送构建请求
     */
    build = () => {
        if (!this.state.value) {
            message.error('请选择svn目录');
            return;
        }
        window.socket.emit('build', { svnBase: this.state.value });
    }

    componentDidMount() {
        this.term = new Terminal();
        this.term.open(document.getElementById('terminal'));
        window.socket.on('term', msg => {
            this.term.writeln(msg);
        });
        window.socket.on('building', isBuilding => this.setState({ isBuilding }));
        this.getFolder();
    }

    render() {
        const { treeData, value, isBuilding } = this.state;

        return (
            <div>
                <div className={styles.form}>
                    svn目录:
                    <TreeSelect
                        className={styles.treeSelect}
                        treeDataSimpleMode
                        value={value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择svn文件夹"
                        onChange={this.onChange}
                        loadData={this.onLoadData}
                        treeData={treeData} />
                </div>
                <Button type="primary" onClick={this.build} loading={isBuilding}>构建</Button>
                <div id="terminal" className={styles.terminal} />
            </div>
        );
    }
}

export default Publish;
