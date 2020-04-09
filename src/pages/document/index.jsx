import React, { Component } from 'react';
import { connect } from 'dva';
import { TreeSelect, Form } from 'antd';

class Doucument extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { files } = this.props.global;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 14 },
        };

        return (
            <div>
                <Form {...formItemLayout}>
                    <Form.Item label="文件构建目录">
                        {
                            getFieldDecorator('entry', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择文件构建目录',
                                    },
                                ],
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{ width: '400px' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择路径"
                                    allowClear
                                    treeData={files} />,
                            )
                        }
                    </Form.Item>
                    <Form.Item label="文档输出目录">
                        {
                            getFieldDecorator('output', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择文档输出目录',
                                    },
                                ],
                            })(
                                <TreeSelect
                                    showSearch
                                    style={{ width: '400px' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择路径"
                                    allowClear
                                    treeData={files} />,
                            )
                        }
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default connect(({ global }) => ({ global }))(Form.create()(Doucument));
